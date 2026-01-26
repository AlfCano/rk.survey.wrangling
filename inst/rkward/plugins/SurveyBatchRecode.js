// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function getCol(id) {
        var raw = getValue(id);
        if (!raw) return [];
        return raw.split("\n").filter(function(n){ return n != "" }).map(function(item) {
            // Fix: Handle nested brackets like obj[["variables"]][["TARGET_COL"]]
            if (item.indexOf("[[") > -1) {
                var parts = item.split('[["');
                var last = parts[parts.length - 1];
                return last.split('"]]')[0];
            } else if (item.indexOf("$") > -1) {
                return item.substring(item.lastIndexOf("$") + 1);
            }
            return item;
        });
    }

    function getDesignName(raw_vars_string) {
        if (!raw_vars_string) return "";
        var first_var = raw_vars_string.split("\n")[0];
        if (first_var.indexOf("$variables") > -1) {
            return first_var.split("$variables")[0];
        } else if (first_var.indexOf("[[") > -1) {
            return first_var.substring(0, first_var.indexOf("[["));
        } else if (first_var.indexOf("$") > -1) {
            return first_var.split("$")[0];
        }
        return first_var;
    }

    // Helper to generate Label Copying code for survey objects
    function genLabelRestoreCode(source_obj, target_obj) {
        var code = "";
        code += "## Restore variable labels\n";
        code += "for(col_name in names(" + target_obj + "$variables)) {\n";
        code += "  try({\n";
        code += "    attr(" + target_obj + "$variables[[col_name]], '.rk.meta') <- attr(" + source_obj + "$variables[[col_name]], '.rk.meta')\n";
        code += "  }, silent=TRUE)\n";
        code += "}\n";
        return code;
    }
  
      var vars = getCol("vars_rc");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_rc");
      var design_name = getDesignName(raw_vars);

      // FIX: Get full raw list to extract sources for label copying
      var raw_var_list = raw_vars.split("\n").filter(function(n){ return n != "" });

      
      vars = vars.slice(0, 1);
      

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
             if (lhs != "NA" && !lhs.startsWith("\"") && !lhs.startsWith("\'")) lhs = "\"" + lhs + "\"";
          }
          if (out_type == "character") {
             if (rhs != "NA" && !rhs.startsWith("\"") && !rhs.startsWith("\'")) rhs = "\"" + rhs + "\"";
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
          if (out_type == "character" && def_val != "NA" && !def_val.startsWith("\"")) { def_val = "\"" + def_val + "\""; }
          args.push(".default = " + def_val);
      }

      var match_args = args.join(", ");
      var name_arg = (suffix == "") ? "" : ", .names = \"{.col}" + suffix + "\"";

      // FIX: Check for Input Type. If Character, wrap input in as.character(.)
      var input_wrapper = ".";
      if (in_type == "character") {
          input_wrapper = "as.character(.)";
      }

      var func_call = "dplyr::case_match(" + input_wrapper + ", " + match_args + ")";
      if (as_fac == "1") { func_call = "as.factor(" + func_call + ")"; }

      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");

      
      // PREVIEW MODE
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% head(50) %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\n");
      // Fix: as.data.frame() instead of $variables
      echo("preview_data <- prev_svy %>% as.data.frame() %>% dplyr::select(dplyr::all_of(c('" + vars[0] + "')), dplyr::contains('" + suffix + "'))\n");
        
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(srvyr)){stop(" + i18n("Preview not available, because package srvyr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(srvyr)\n");
	}	if(is_preview) {
		echo("if(!base::require(dplyr)){stop(" + i18n("Preview not available, because package dplyr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(dplyr)\n");
	}	if(is_preview) {
		echo("if(!base::require(survey)){stop(" + i18n("Preview not available, because package survey is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(survey)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function getCol(id) {
        var raw = getValue(id);
        if (!raw) return [];
        return raw.split("\n").filter(function(n){ return n != "" }).map(function(item) {
            // Fix: Handle nested brackets like obj[["variables"]][["TARGET_COL"]]
            if (item.indexOf("[[") > -1) {
                var parts = item.split('[["');
                var last = parts[parts.length - 1];
                return last.split('"]]')[0];
            } else if (item.indexOf("$") > -1) {
                return item.substring(item.lastIndexOf("$") + 1);
            }
            return item;
        });
    }

    function getDesignName(raw_vars_string) {
        if (!raw_vars_string) return "";
        var first_var = raw_vars_string.split("\n")[0];
        if (first_var.indexOf("$variables") > -1) {
            return first_var.split("$variables")[0];
        } else if (first_var.indexOf("[[") > -1) {
            return first_var.substring(0, first_var.indexOf("[["));
        } else if (first_var.indexOf("$") > -1) {
            return first_var.split("$")[0];
        }
        return first_var;
    }

    // Helper to generate Label Copying code for survey objects
    function genLabelRestoreCode(source_obj, target_obj) {
        var code = "";
        code += "## Restore variable labels\n";
        code += "for(col_name in names(" + target_obj + "$variables)) {\n";
        code += "  try({\n";
        code += "    attr(" + target_obj + "$variables[[col_name]], '.rk.meta') <- attr(" + source_obj + "$variables[[col_name]], '.rk.meta')\n";
        code += "  }, silent=TRUE)\n";
        code += "}\n";
        return code;
    }
  
      var vars = getCol("vars_rc");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_rc");
      var design_name = getDesignName(raw_vars);

      // FIX: Get full raw list to extract sources for label copying
      var raw_var_list = raw_vars.split("\n").filter(function(n){ return n != "" });

      

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
             if (lhs != "NA" && !lhs.startsWith("\"") && !lhs.startsWith("\'")) lhs = "\"" + lhs + "\"";
          }
          if (out_type == "character") {
             if (rhs != "NA" && !rhs.startsWith("\"") && !rhs.startsWith("\'")) rhs = "\"" + rhs + "\"";
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
          if (out_type == "character" && def_val != "NA" && !def_val.startsWith("\"")) { def_val = "\"" + def_val + "\""; }
          args.push(".default = " + def_val);
      }

      var match_args = args.join(", ");
      var name_arg = (suffix == "") ? "" : ", .names = \"{.col}" + suffix + "\"";

      // FIX: Check for Input Type. If Character, wrap input in as.character(.)
      var input_wrapper = ".";
      if (in_type == "character") {
          input_wrapper = "as.character(.)";
      }

      var func_call = "dplyr::case_match(" + input_wrapper + ", " + match_args + ")";
      if (as_fac == "1") { func_call = "as.factor(" + func_call + ")"; }

      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");

      
      // MAIN MODE
      // GOLDEN RULE 7 FIX: Hardcoded "design_rec" (matches initial="design_rec")
      echo("design_rec <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\n");

      // Restore general labels
      echo(genLabelRestoreCode(design_name, "design_rec"));

      // Explicitly copy labels for NEW recoded variables
      echo("\n# Copy variable labels to the new recoded variables\n");
      for (var i = 0; i < vars.length; i++) {
          var old_v = vars[i];
          var new_v = old_v + suffix;
          var source_path = raw_var_list[i];
          // FIX: Access srvyr object like a dataframe
          echo("try(attr(design_rec[['" + new_v + "']], '.rk.meta') <- attr(" + source_path + ", '.rk.meta'), silent=TRUE)\n");
      }
        
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Survey Batch Recode results")).print();	
	}
    if(getValue("save_rc.active")) {
      var save_name = getValue("save_rc").replace(/"/g, "\\\"");
      echo("rk.header(\"Survey Batch Recode: " + save_name + "\", level=3, toc=FALSE)\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var saveRc = getValue("save_rc");
		var saveRcActive = getValue("save_rc.active");
		var saveRcParent = getValue("save_rc.parent");
		// assign object to chosen environment
		if(saveRcActive) {
			echo(".GlobalEnv$" + saveRc + " <- design_rec\n");
		}	
	}

}

