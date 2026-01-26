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
  
      var vars = getCol("vars_tr");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_tr");
      var design_name = getDesignName(raw_vars);

      var func = getValue("func_tr");
      var func_cust = getValue("func_cust");
      var use_na_rm = getValue("tr_narm_cbox") == "1";
      var naming = getValue("names_tr");
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
      var name_arg = (naming == "") ? "" : ", .names = \"" + naming + "\"";

      
      // PREVIEW MODE
      vars = vars.slice(0, 1); // Limit to 1 var
      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");

      // Calculate on survey, convert to DF, then select columns
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% head(50)" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\n");
      // Fix: Direct conversion to dataframe
      echo("preview_data <- prev_svy %>% as.data.frame()\n");
        
}

function preprocess(is_preview){
	// add requirements etc. here

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
  
      var vars = getCol("vars_tr");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_tr");
      var design_name = getDesignName(raw_vars);

      var func = getValue("func_tr");
      var func_cust = getValue("func_cust");
      var use_na_rm = getValue("tr_narm_cbox") == "1";
      var naming = getValue("names_tr");
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
      var name_arg = (naming == "") ? "" : ", .names = \"" + naming + "\"";

      
      // MAIN MODE
      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");
      echo("require(srvyr)\n");
      // GOLDEN RULE 7 FIX: Hardcoded "design_tr" (matches initial)
      echo("design_tr <- " + design_name + " %>% srvyr::as_survey()" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\n");

      // Restore labels
      echo(genLabelRestoreCode(design_name, "design_tr"));
        
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Survey Batch Transform results")).print();	
	}
    if(getValue("save_tr.active")) {
      var save_name = getValue("save_tr").replace(/"/g, "\\\"");
      echo("rk.header(\"Survey Batch Transform: " + save_name + "\", level=3, toc=FALSE)\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var saveTr = getValue("save_tr");
		var saveTrActive = getValue("save_tr.active");
		var saveTrParent = getValue("save_tr.parent");
		// assign object to chosen environment
		if(saveTrActive) {
			echo(".GlobalEnv$" + saveTr + " <- design_tr\n");
		}	
	}

}

