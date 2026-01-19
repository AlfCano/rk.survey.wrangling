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
      var name_arg = (naming == "") ? "" : ", .names = \"" + naming + "\"";

      
      // PREVIEW MODE
      vars = vars.slice(0, 1); // Limit to 1 var
      var quoted_vars = vars.map(function(v) { return "\"" + v + "\""; }).join(", ");

      echo("require(srvyr)\n");
      echo("require(dplyr)\n");
      // Calculate, then convert to dataframe, THEN head(50).
      // Converting to DF first ensures we lose the complex survey list structure which confuses the previewer.
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey()" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\n");
      echo("preview_data <- prev_svy$variables %>% as.data.frame() %>% head(50)\n");
      
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
      var name_arg = (naming == "") ? "" : ", .names = \"" + naming + "\"";

      
      // MAIN MODE
      var quoted_vars = vars.map(function(v) { return "\"" + v + "\""; }).join(", ");
      echo("require(srvyr)\n");
      echo("design_tr <- " + design_name + " %>% srvyr::as_survey()" + group_start + " %>% dplyr::mutate(dplyr::across(c(" + quoted_vars + "), " + fn_call + name_arg + "))" + group_end + "\n");

      // Copy labels for Transform as well
      echo("\n# Copy variable labels\n");
      for (var i = 0; i < vars.length; i++) {
          var old_v = vars[i];
          // We assume default naming for label copying if custom naming is used it is hard to predict
          // But if naming is default:
          echo("try(attr(" + save_name + "[['variables']][['" + old_v + "']], '.rk.meta') <- attr(" + design_name + "[['variables']][['" + old_v + "']], '.rk.meta'), silent=TRUE)\n");
      }
      
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Survey Batch Transform results")).print();	
	}if(getValue("save_tr.active")) { echo("rk.header(\"Survey Batch Transform: " + getValue("save_tr") + "\", level=3, toc=FALSE)\n"); }
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

