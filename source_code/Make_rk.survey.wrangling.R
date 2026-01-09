local({
  # =========================================================================================
  # 1. Package Definition and Metadata
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.08-1")

  plugin_name <- "rk.survey.wrangling"
  plugin_ver <- "0.1.0"

  package_about <- rk.XML.about(
    name = plugin_name,
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "A suite of plugins for manipulating complex survey objects using 'srvyr' and 'survey'. Includes batch transformations, recoding, and scoring within survey designs.",
      version = plugin_ver,
      date = format(Sys.Date(), "%Y-%m-%d"),
      url = "https://github.com/AlfCano/rk.survey.wrangling",
      license = "GPL (>= 3)"
    )
  )

  # =========================================================================================
  # 2. JS Helpers
  # =========================================================================================
  js_common_helper <- '
    function getCol(id) {
        var raw = getValue(id);
        if (!raw) return [];
        return raw.split("\\n").filter(function(n){ return n != "" }).map(function(item) {
            if (item.indexOf("[[") > -1) {
                var parts = item.split(\'[[\"\');
                var last = parts[parts.length - 1];
                return last.split(\'"]]\')[0];
            } else if (item.indexOf("$") > -1) {
                return item.substring(item.lastIndexOf("$") + 1);
            }
            return item;
        });
    }

    function getDesignName(raw_vars_string) {
        if (!raw_vars_string) return "";
        var first_var = raw_vars_string.split("\\n")[0];
        if (first_var.indexOf("$variables") > -1) {
            return first_var.split("$variables")[0];
        } else if (first_var.indexOf("[[") > -1) {
            return first_var.substring(0, first_var.indexOf("[["));
        } else if (first_var.indexOf("$") > -1) {
            return first_var.split("$")[0];
        }
        return first_var;
    }
  '

  # =========================================================================================
  # 3. Component A: Survey Batch Transform
  # =========================================================================================
  svy_tr_selector <- rk.XML.varselector(id.name = "sel_svy_tr")
  attr(svy_tr_selector, "classes") <- "survey.design"

  svy_tr_vars <- rk.XML.varslot(label = "Variables to transform", source = "sel_svy_tr", multi = TRUE, required = TRUE, id.name = "vars_tr")
  attr(svy_tr_vars, "source_property") <- "variables"

  svy_tr_group <- rk.XML.varslot(label = "Grouping variable(s) (Optional)", source = "sel_svy_tr", multi = TRUE, id.name = "vars_group_tr")
  attr(svy_tr_group, "source_property") <- "variables"

  svy_tr_func_drop <- rk.XML.dropdown(label = "Function", id.name = "func_tr", options = list(
      "Logarithm (log)" = list(val = "log", chk = TRUE),
      "Log10 (log10)" = list(val = "log10"),
      "Exponential (exp)" = list(val = "exp"),
      "Square Root (sqrt)" = list(val = "sqrt"),
      "Abs (abs)" = list(val = "abs"),
      "Standardize (scale)" = list(val = "scale"),
      "Convert to Numeric" = list(val = "as.numeric"),
      "Convert to Factor" = list(val = "as.factor"),
      "Custom..." = list(val = "custom")
  ))

  svy_tr_narm <- rk.XML.cbox(label = "Ignore NAs (na.rm = TRUE)", value = "1", chk = TRUE, id.name = "tr_narm_cbox")
  svy_tr_cust_input <- rk.XML.input(label = "Custom function (e.g., function(x) x^2)", id.name = "func_cust")
  attr(svy_tr_cust_input, "dependencies") <- list(active = list(string = "func_tr.string == 'custom'"))

  svy_tr_naming <- rk.XML.input(label = "Naming pattern (glue syntax)", initial = "{.col}_{.fn}", id.name = "names_tr")
  svy_tr_help_label <- rk.XML.text("Use <b>{.col}</b> for original name and <b>{.fn}</b> for function name.<br>Leave empty to overwrite original variables.")

  svy_tr_save <- rk.XML.saveobj(label="Save to (overwrite or new object)", initial="design_tr", chk=TRUE, id.name="save_tr")
  svy_tr_preview <- rk.XML.preview(label="Preview data", id.name="preview_tr", mode="data")
  svy_tr_preview_note <- rk.XML.text("<i>Note: Preview limited to the first selected variable and 50 rows.</i>")

  svy_tr_dialog <- rk.XML.dialog(label = "Survey Batch Transform", child = rk.XML.tabbook(tabs = list(
      "Variable Selection" = rk.XML.row(rk.XML.col(svy_tr_selector), rk.XML.col(svy_tr_vars, rk.XML.stretch(), rk.XML.frame(svy_tr_group, label = "Grouped Calculation"))),
      "Transformation" = rk.XML.col(svy_tr_func_drop, svy_tr_narm, svy_tr_cust_input, rk.XML.stretch()),
      "Output Options" = rk.XML.col(svy_tr_naming, svy_tr_help_label, rk.XML.stretch(), svy_tr_preview, svy_tr_preview_note, svy_tr_save)
  )))

  js_gen_svy_tr <- function(is_preview) {
    paste0(js_common_helper, '
      var vars = getCol("vars_tr");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_tr");
      var design_name = getDesignName(raw_vars);

      var func = getValue("func_tr");
      var func_cust = getValue("func_cust");
      var use_na_rm = getValue("tr_narm_cbox") == "1";
      var naming = getValue("names_tr");
      var save_name = getValue("save_tr");
      var groups = getCol("vars_group_tr");

      var group_start = "";
      var group_end = "";
      if (groups.length > 0) {
          group_start = " %>% srvyr::group_by(" + groups.join(", ") + ")";
          group_end = " %>% srvyr::ungroup()";
      }

      var fn_call = "";
      if (func == "custom") {
          fn_call = func_cust;
      } else {
          if (use_na_rm && ["mean","sum","sd","var","min","max"].indexOf(func) > -1) {
             fn_call = "list(" + func + " = ~ " + func + "(., na.rm = TRUE))";
          } else {
             fn_call = func;
          }
      }
      var name_arg = (naming == "") ? "" : ", .names = \\"" + naming + "\\"";

      ', if(is_preview) '
      // PREVIEW MODE
      vars = vars.slice(0, 1); // Limit to 1 var
      var quoted_vars = vars.map(function(v) { return "\\"" + v + "\\""; }).join(", ");

      echo("require(srvyr)\\n");
      echo("require(dplyr)\\n");
      // Calculate, then convert to dataframe, THEN head(50).
      // Converting to DF first ensures we lose the complex survey list structure which confuses the previewer.
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey()" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\\n");
      echo("preview_data <- prev_svy$variables %>% as.data.frame() %>% head(50)\\n");
      ' else '
      // MAIN MODE
      var quoted_vars = vars.map(function(v) { return "\\"" + v + "\\""; }).join(", ");
      echo("require(srvyr)\\n");
      echo(save_name + " <- " + design_name + " %>% srvyr::as_survey()" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\\n");

      // Copy labels for Transform as well
      echo("\\n# Copy variable labels\\n");
      for (var i = 0; i < vars.length; i++) {
          var old_v = vars[i];
          // We assume default naming for label copying if custom naming is used it is hard to predict
          // But if naming is default:
          echo("try(attr(" + save_name + "[[\'variables\']][[\'" + old_v + "\']], \'.rk.meta\') <- attr(" + design_name + "[[\'variables\']][[\'" + old_v + "\']], \'.rk.meta\'), silent=TRUE)\\n");
      }
      '
    )
  }
  js_print_svy_tr <- 'if(getValue("save_tr.active")) { echo("rk.header(\\"Survey Batch Transform: " + getValue("save_tr") + "\\", level=3, toc=FALSE)\\n"); }'

  # =========================================================================================
  # 4. Component B: Survey Batch Recode
  # =========================================================================================
  svy_rc_selector <- rk.XML.varselector(id.name = "sel_svy_rc")
  attr(svy_rc_selector, "classes") <- "survey.design"

  svy_rc_vars <- rk.XML.varslot(label = "Variables to recode", source = "sel_svy_rc", multi = TRUE, required = TRUE, id.name = "vars_rc")
  attr(svy_rc_vars, "source_property") <- "variables"

  svy_rc_matrix <- rk.XML.matrix(label = "Mapping Rules", id.name = "matrix_rules", columns = 2, min = 0, horiz_headers = c("Old Value", "New Value"), mode="string")

  svy_rc_in_type <- rk.XML.dropdown(label = "Input Data Type (Old Value)", id.name = "type_rc_in", options = list("Numeric / Integer" = list(val = "numeric", chk = TRUE), "Character / Factor" = list(val = "character")))
  svy_rc_else_radio <- rk.XML.radio(label = "Unmatched values (Else)", id.name = "rad_else_mode", options = list("Copy original values (Default)" = list(val = "copy", chk = TRUE), "Set to NA" = list(val = "na"), "Specific value..." = list(val = "specific")))
  svy_rc_else_custom <- rk.XML.input(label = "Value", id.name = "inp_else_custom", initial = "Other")
  attr(svy_rc_else_custom, "dependencies") <- list(active = list(string = "rad_else_mode.string == 'specific'"))

  svy_rc_out_type <- rk.XML.dropdown(label = "Output Data Type (New Value)", id.name = "type_rc_out", options = list("Numeric / Integer" = list(val = "numeric"), "Character / Factor" = list(val = "character", chk = TRUE)))
  svy_rc_suffix <- rk.XML.input(label = "Suffix", id.name = "suffix_rc", initial = "_rec")
  svy_rc_as_factor <- rk.XML.cbox(label = "Convert output to factor", id.name = "as_factor_rc", value = "1", chk=TRUE)

  svy_rc_save <- rk.XML.saveobj(label="Save result object", initial="design_rec", chk=TRUE, id.name="save_rc")
  svy_rc_preview <- rk.XML.preview(label="Preview data", id.name="preview_rc", mode="data")
  svy_rc_preview_note <- rk.XML.text("<i>Note: Preview limited to the first selected variable and 50 rows.</i>")

  svy_rc_dialog <- rk.XML.dialog(label = "Survey Batch Recode", child = rk.XML.tabbook(tabs = list(
      "Variable Selection" = rk.XML.row(rk.XML.col(svy_rc_selector), rk.XML.col(svy_rc_vars, rk.XML.stretch())),
      "Recode Rules" = rk.XML.col(svy_rc_in_type, svy_rc_matrix, rk.XML.frame(svy_rc_else_radio, svy_rc_else_custom, label="Default Behavior")),
      "Output Options" = rk.XML.col(svy_rc_out_type, svy_rc_suffix, svy_rc_as_factor, rk.XML.stretch(), svy_rc_preview, svy_rc_preview_note, svy_rc_save)
  )))

  js_gen_svy_rc <- function(is_preview) {
    paste0(js_common_helper, '
      var vars = getCol("vars_rc");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_rc");
      var design_name = getDesignName(raw_vars);

      ', if(is_preview) '
      vars = vars.slice(0, 1);
      ', '

      var in_type = getValue("type_rc_in");
      var out_type = getValue("type_rc_out");
      var suffix = getValue("suffix_rc");
      var as_fac = getValue("as_factor_rc");
      var else_mode = getValue("rad_else_mode");
      var else_custom = getValue("inp_else_custom");
      var save_name = getValue("save_rc");

      var olds = getList("matrix_rules.0");
      var news = getList("matrix_rules.1");
      var args = [];
      for (var i = 0; i < olds.length; i++) {
          var lhs = String(olds[i]).trim(); var rhs = String(news[i]).trim();
          if (lhs === "" || rhs === "") continue;

          var force_quote = lhs.indexOf(" ") > -1;
          if (in_type == "character" || force_quote) {
             if (lhs != "NA" && !lhs.startsWith("\\"") && !lhs.startsWith("\\\'")) lhs = "\\"" + lhs + "\\"";
          }
          if (out_type == "character") {
             if (rhs != "NA" && !rhs.startsWith("\\"") && !rhs.startsWith("\\\'")) rhs = "\\"" + rhs + "\\"";
          }
          args.push(lhs + " ~ " + rhs);
      }

      if (else_mode == "copy") {
          if (in_type == out_type) { args.push(".default = ."); }
          else {
             if (out_type == "character") args.push(".default = as.character(.)");
             else args.push(".default = as.numeric(.)");
          }
      }
      else if (else_mode == "na") { args.push(".default = NA"); }
      else if (else_mode == "specific") {
          var def_val = else_custom;
          if (out_type == "character" && def_val != "NA" && !def_val.startsWith("\\"")) { def_val = "\\"" + def_val + "\\""; }
          args.push(".default = " + def_val);
      }

      var match_args = args.join(", ");
      var name_arg = (suffix == "") ? "" : ", .names = \\"{.col}" + suffix + "\\"";
      var func_call = "dplyr::case_match(., " + match_args + ")";
      if (as_fac == "1") { func_call = "as.factor(" + func_call + ")"; }

      var quoted_vars = vars.map(function(v) { return "\\"" + v + "\\""; }).join(", ");

      echo("require(srvyr)\\n");
      echo("require(dplyr)\\n");

      ', if(is_preview) '
      // PREVIEW MODE
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\\n");
      // Explicitly select Original and New columns, convert to dataframe, then HEAD
      echo("preview_data <- prev_svy$variables %>% dplyr::select(dplyr::all_of(c(\'" + vars[0] + "\')), dplyr::contains(\'" + suffix + "\')) %>% as.data.frame() %>% head(50)\\n");
      ' else '
      // MAIN MODE
      echo(save_name + " <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\\n");

      echo("\\n# Copy variable labels to the new recoded variables\\n");
      for (var i = 0; i < vars.length; i++) {
          var old_v = vars[i];
          var new_v = old_v + suffix;
          echo("try(attr(" + save_name + "[[\'variables\']][[\'" + new_v + "\']], \'.rk.meta\') <- attr(" + design_name + "[[\'variables\']][[\'" + old_v + "\']], \'.rk.meta\'), silent=TRUE)\\n");
      }
      ', '
    ')
  }
  js_print_svy_rc <- 'if(getValue("save_rc.active")) { echo("rk.header(\\"Survey Batch Recode: " + getValue("save_rc") + "\\", level=3, toc=FALSE)\\n"); }'

  # =========================================================================================
  # 5. Component C: Survey Composite Score
  # =========================================================================================
  svy_cp_selector <- rk.XML.varselector(id.name = "sel_svy_cp")
  attr(svy_cp_selector, "classes") <- "survey.design"

  svy_cp_vars <- rk.XML.varslot(label = "Items to aggregate", source = "sel_svy_cp", multi = TRUE, required = TRUE, id.name = "vars_cp")
  attr(svy_cp_vars, "source_property") <- "variables"

  svy_cp_method <- rk.XML.dropdown(label = "Aggregation Method", id.name = "method_cp", options = list("Mean (Average)" = list(val = "rowMeans", chk = TRUE), "Sum (Total)" = list(val = "rowSums"), "Median" = list(val = "median"), "Minimum" = list(val = "pmin"), "Maximum" = list(val = "pmax"), "Standard Deviation (SD)" = list(val = "sd"), "Variance" = list(val = "var"), "Count (N valid)" = list(val = "count")))
  svy_cp_na <- rk.XML.cbox(label = "Remove NAs (na.rm = TRUE)", value = "1", chk = TRUE, id.name = "na_cp")
  svy_cp_newname <- rk.XML.input(label = "Name of new variable", initial = "new_score", required = TRUE, id.name = "name_cp")

  svy_cp_save <- rk.XML.saveobj(label="Save result as", initial="design_score", chk=TRUE, id.name="save_cp")
  svy_cp_preview <- rk.XML.preview(label="Preview data", id.name="preview_cp", mode="data")
  svy_cp_preview_note <- rk.XML.text("<i>Note: Preview limited to 50 rows.</i>")

  svy_cp_dialog <- rk.XML.dialog(label = "Survey Composite Score", child = rk.XML.tabbook(tabs = list(
      "Variable Selection" = rk.XML.row(rk.XML.col(svy_cp_selector), rk.XML.col(svy_cp_vars, rk.XML.stretch())),
      "Settings" = rk.XML.col(svy_cp_method, svy_cp_na, rk.XML.stretch()),
      "Output Options" = rk.XML.col(svy_cp_newname, rk.XML.stretch(), svy_cp_preview, svy_cp_preview_note, svy_cp_save)
  )))

  js_gen_svy_cp <- function(is_preview) {
    paste0(js_common_helper, '
      var vars = getCol("vars_cp");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_cp");
      var design_name = getDesignName(raw_vars);

      var method = getValue("method_cp");
      var newname = getValue("name_cp");
      var use_na = getValue("na_cp") == "1";
      var na_arg = use_na ? "TRUE" : "FALSE";
      var save_name = getValue("save_cp");

      var quoted_vars = vars.map(function(v) { return "\\"" + v + "\\""; }).join(", ");
      var vars_str = "dplyr::pick(c(" + quoted_vars + "))";
      var calc_code = "";

      if (method == "rowMeans") { calc_code = "rowMeans(" + vars_str + ", na.rm = " + na_arg + ")"; }
      else if (method == "rowSums") { calc_code = "rowSums(" + vars_str + ", na.rm = " + na_arg + ")"; }
      else if (method == "pmin") { calc_code = "do.call(pmin, c(" + vars_str + ", list(na.rm = " + na_arg + ")))"; }
      else if (method == "pmax") { calc_code = "do.call(pmax, c(" + vars_str + ", list(na.rm = " + na_arg + ")))"; }
      else if (method == "sd") { calc_code = "apply(" + vars_str + ", 1, sd, na.rm = " + na_arg + ")"; }
      else if (method == "median") { calc_code = "apply(" + vars_str + ", 1, median, na.rm = " + na_arg + ")"; }
      else if (method == "var") { calc_code = "apply(" + vars_str + ", 1, var, na.rm = " + na_arg + ")"; }
      else if (method == "count") { calc_code = "rowSums(!is.na(" + vars_str + "))"; }

      echo("require(srvyr)\\n");
      echo("require(dplyr)\\n");

      ', if(is_preview) '
      // PREVIEW MODE
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(" + newname + " = " + calc_code + ")\\n");
      // Extract only selected columns + new column, then head
      echo("preview_data <- prev_svy$variables %>% dplyr::select(dplyr::all_of(c(" + quoted_vars + ")), dplyr::all_of(c(\"" + newname + "\"))) %>% as.data.frame() %>% head(50)\\n");
      ' else '
      // MAIN MODE
      echo(save_name + " <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(" + newname + " = " + calc_code + ")\\n");
      ', '
    ')
  }
  js_print_svy_cp <- 'if(getValue("save_cp.active")) { echo("rk.header(\\"Survey Composite Score Created: " + getValue("name_cp") + "\\", level=3, toc=FALSE)\\n"); }'

  # =========================================================================================
  # 6. Final Skeleton Generation
  # =========================================================================================

  comp_svy_recode <- rk.plugin.component("Survey Batch Recode", xml = list(dialog = svy_rc_dialog), js = list(require = c("srvyr", "dplyr", "survey"), calculate = js_gen_svy_rc(FALSE), preview = js_gen_svy_rc(TRUE), printout = js_print_svy_rc), hierarchy = list("Survey", "Survey Wrangling"), rkh = list(summary = rk.rkh.summary("Recode multiple variables within a survey design object using srvyr.")))

  comp_svy_composite <- rk.plugin.component("Survey Composite Score", xml = list(dialog = svy_cp_dialog), js = list(require = c("srvyr", "dplyr", "survey"), calculate = js_gen_svy_cp(FALSE), preview = js_gen_svy_cp(TRUE), printout = js_print_svy_cp), hierarchy = list("Survey", "Survey Wrangling"), rkh = list(summary = rk.rkh.summary("Calculate row-wise scores (Mean/Sum) within a survey design object.")))

  rk.plugin.skeleton(
    about = package_about,
    path = ".",
    xml = list(dialog = svy_tr_dialog),
    js = list(calculate = js_gen_svy_tr(FALSE), preview = js_gen_svy_tr(TRUE), printout = js_print_svy_tr),
    rkh = list(summary = rk.rkh.summary("Apply a function to multiple variables within a survey design object using srvyr.")),
    pluginmap = list(name = "Survey Batch Transform", hierarchy = list("Survey", "Survey Wrangling")),
    components = list(comp_svy_recode, comp_svy_composite),
    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE, overwrite = TRUE, show = FALSE
  )

  cat("\nPlugin 'rk.survey.wrangling' (v0.1.0) generated successfully.\n")
})
