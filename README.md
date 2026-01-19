# rk.survey.wrangling: Tidy Manipulation of Complex Surveys

![Version](https://img.shields.io/badge/Version-0.1.2-blue.svg)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)
![RKWard](https://img.shields.io/badge/Platform-RKWard-green)
[![R Linter](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml/badge.svg)](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml)

**rk.survey.wrangling** extends RKWard's capabilities to handle complex survey designs (`svydesign` objects). It leverages the `{srvyr}` package to apply modern, "tidy" manipulation verbs (like `mutate`, `group_by`, and `across`) to survey data while automatically preserving sampling weights, stratification, and variance estimation parameters.

## 🚀 What's New in Version 0.1.2

This release creates a stable foundation for production use by addressing critical logic errors:

*   **Object Assignment Fix:** Resolved a "Golden Rule" violation where the plugin attempted to save results to dynamic variable names inside the calculation block. It now correctly uses hardcoded internal names, allowing RKWard to handle the final assignment to the user's chosen object safely.
*   **Preview Stability:** Completely rewrote the preview generation logic. It now converts the `srvyr` object to a standard data frame *before* selecting columns, ensuring the "50 rows limit" works correctly and preventing errors when subsetting complex survey objects.
*   **Label Preservation:** Enhanced the metadata handling to ensure RKWard variable labels are preserved even after complex transformations or recoding.

## 🚀 What's New in Version 0.1.1

*   **Robust Variable Handling:** Fixed syntax errors when variables contain spaces or special characters (e.g., `"Mucha confianza"`).
*   **Recode Matrix:** The spreadsheet interface for recoding now correctly accepts mixed data types (text/numbers) without validation errors blocking the "Submit" button.

## ✨ Features

### 1. Survey Batch Transform
Apply functions to multiple variables within a design object simultaneously.
*   **Vectorized Operations:** Log, Scale, Exponential, or custom functions applied to $N$ variables.
*   **Grouped Calculation:** Calculate statistics relative to a group (e.g., centering income *within* a region) using implicit `group_by` -> `mutate` -> `ungroup`.
*   **Smart Naming:** Rename variables automatically using glue syntax (`{.col}_{.fn}`).

### 2. Survey Batch Recode
A spreadsheet-like interface for recoding variables inside a design.
*   **Type Safety:** Options to strictly handle Numeric vs. Character conversions to prevent R errors.
*   **Default Handling:** Flexible "Else" logic (Copy original, NA, or Specific Value).
*   **Smart Preview:** Displays only the original and the new variable side-by-side for verification.

### 3. Survey Composite Score
Calculate new variables based on row-wise aggregation of items.
*   **Methods:** Mean, Sum, Median, SD, Min/Max.
*   **Context:** Unlike standard data frames, this adds the new score directly into the survey design object, ready for weighted regression or tabulation.

### 🌍 Internationalization
The interface is fully localized in:
*   🇺🇸 English (Default)
*   🇪🇸 Spanish (`es`)
*   🇫🇷 French (`fr`)
*   🇩🇪 German (`de`)
*   🇧🇷 Portuguese (Brazil) (`pt_BR`)

## 📦 Installation

This plugin is not yet on CRAN. To install it, use the `remotes` or `devtools` package in RKWard.

1.  **Open RKWard**.
2.  **Run the following command** in the R Console:

    ```R
    # If you don't have devtools installed:
    # install.packages("devtools")
    
    local({
      require(devtools)
      install_github("AlfCano/rk.survey.wrangling", force = TRUE)
    })
    ```
3.  **Restart RKWard** to load the new menu entries.

## 💻 Usage

Once installed, the tools are organized under the **Survey** menu:

**`Survey` -> `Survey Wrangling`**

1.  **Survey Batch Transform**
2.  **Survey Batch Recode**
3.  **Survey Composite Score**

## 🛠️ Dependencies

This plugin relies on the following R packages:
*   `srvyr` (The tidy-survey bridge)
*   `survey` (Core statistical engine)
*   `dplyr` (Manipulation logic)
*   `rkwarddev` (Plugin generation)

#### Troubleshooting: Errors installing `devtools` or missing binary dependencies (Windows)

If you encounter errors mentioning "non-zero exit status", "namespace is already loaded", or requirements for compilation (compiling from source) when installing packages, it is likely because the R version bundled with RKWard is older than the current CRAN standard.

**Workaround:**
Until a new, more recent version of R (current bundled version is 4.3.3) is packaged into the RKWard executable, these issues will persist. To fix this:

1.  Download and install the latest version of R (e.g., 4.5.2 or newer) from [CRAN](https://cloud.r-project.org/).
2.  Open RKWard and go to the **Settings** (or Preferences) menu.
3.  Run the **"Installation Checker"**.
4.  Point RKWard to the newly installed R version.

This "two-step" setup (similar to how RStudio operates) ensures you have access to the latest pre-compiled binaries, avoiding the need for RTools and manual compilation.

## ✍️ Author & License

*   **Author:** Alfonso Cano (<alfonso.cano@correo.buap.mx>)
*   **Assisted by:** Gemini, a large language model from Google.
*   **License:** GPL (>= 3)
