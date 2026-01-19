// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function getCol(id) {
        var raw = getValue(id);
        if (!raw) return [];
        return raw.split("\n").filter(function(n){ return n != "" }).map(function(item) {
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
  
      var vars = getCol("vars_rc");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_rc");
      var design_name = getDesignName(raw_vars);

      
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
      var func_call = "dplyr::case_match(., " + match_args + ")";
      if (as_fac == "1") { func_call = "as.factor(" + func_call + ")"; }

      var quoted_vars = vars.map(function(v) { return "\"" + v + "\""; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");

      
      // PREVIEW MODE
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\n");
      // Explicitly select Original and New columns, convert to dataframe, then HEAD
      echo("preview_data <- prev_svy$variables %>% dplyr::select(dplyr::all_of(c('" + vars[0] + "')), dplyr::contains('" + suffix + "')) %>% as.data.frame() %>% head(50)\n");
      
    
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
  
      var vars = getCol("vars_rc");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_rc");
      var design_name = getDesignName(raw_vars);

      

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
      var func_call = "dplyr::case_match(., " + match_args + ")";
      if (as_fac == "1") { func_call = "as.factor(" + func_call + ")"; }

      var quoted_vars = vars.map(function(v) { return "\"" + v + "\""; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");

      
      // MAIN MODE
      echo("design_rec <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), ~ " + func_call + name_arg + "))\n");

      echo("\n# Copy variable labels to the new recoded variables\n");
      for (var i = 0; i < vars.length; i++) {
          var old_v = vars[i];
          var new_v = old_v + suffix;
          echo("try(attr(" + save_name + "[['variables']][['" + new_v + "']], '.rk.meta') <- attr(" + design_name + "[['variables']][['" + old_v + "']], '.rk.meta'), silent=TRUE)\n");
      }
      
    
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Survey Batch Recode results")).print();	
	}if(getValue("save_rc.active")) { echo("rk.header(\"Survey Batch Recode: " + getValue("save_rc") + "\", level=3, toc=FALSE)\n"); }
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

