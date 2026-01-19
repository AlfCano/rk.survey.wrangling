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
  
      var vars = getCol("vars_cp");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_cp");
      var design_name = getDesignName(raw_vars);

      var method = getValue("method_cp");
      var newname = getValue("name_cp");
      var use_na = getValue("na_cp") == "1";
      var na_arg = use_na ? "TRUE" : "FALSE";
      var save_name = getValue("save_cp");
      
      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");
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
      
      echo("require(srvyr)\n");
      echo("require(dplyr)\n");
      
      
      // PREVIEW MODE
      echo("prev_svy <- " + design_name + " %>% srvyr::as_survey() %>% head(50) %>% dplyr::mutate(" + newname + " = " + calc_code + ")\n");
      // Fix: as.data.frame()
      echo("preview_data <- prev_svy %>% as.data.frame() %>% dplyr::select(dplyr::all_of(c(" + quoted_vars + ")), dplyr::all_of(c('" + newname + "')))\n");
        
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
  
      var vars = getCol("vars_cp");
      if (vars.length === 0) return;
      var raw_vars = getValue("vars_cp");
      var design_name = getDesignName(raw_vars);

      var method = getValue("method_cp");
      var newname = getValue("name_cp");
      var use_na = getValue("na_cp") == "1";
      var na_arg = use_na ? "TRUE" : "FALSE";
      var save_name = getValue("save_cp");
      
      var quoted_vars = vars.map(function(v) { return "'" + v + "'"; }).join(", ");
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
      
      echo("require(srvyr)\n");
      echo("require(dplyr)\n");
      
      
      // MAIN MODE
      // FIXED: Hardcoded "design_score"
      echo("design_score <- " + design_name + " %>% srvyr::as_survey() %>% dplyr::mutate(" + newname + " = " + calc_code + ")\n");
      
      // Restore labels
      echo(genLabelRestoreCode(design_name, "design_score"));
        
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Survey Composite Score results")).print();	
	}
    if(getValue("save_cp.active")) {
      var save_name = getValue("save_cp").replace(/"/g, "\\\"");
      echo("rk.header(\"Survey Composite Score Created: " + save_name + "\", level=3, toc=FALSE)\n");
    }
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var saveCp = getValue("save_cp");
		var saveCpActive = getValue("save_cp.active");
		var saveCpParent = getValue("save_cp.parent");
		// assign object to chosen environment
		if(saveCpActive) {
			echo(".GlobalEnv$" + saveCp + " <- design_score\n");
		}	
	}

}

