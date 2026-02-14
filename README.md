# rk.survey.wrangling: Tidy Manipulation of Complex Surveys

![Version](https://img.shields.io/badge/Version-0.1.4-blue.svg)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)
![RKWard](https://img.shields.io/badge/Platform-RKWard-green)
[![R Linter](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml/badge.svg)](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml)

**rk.survey.wrangling** extends RKWard's capabilities to handle complex survey designs (`svydesign` objects). It leverages the `{srvyr}` package to apply modern, "tidy" manipulation verbs (like `mutate`, `group_by`, and `across`) to survey data while automatically preserving sampling weights, stratification, and variance estimation parameters.

## 🚀 What's New in Version 0.1.4

This release significantly expands the transformation capabilities and fixes critical metadata bugs:

*   **Expanded Transformation Library:** The **Batch Transform** component now includes summary statistics: **Mean, Sum, Standard Deviation, Variance, Minimum, and Maximum**. These work seamlessly with the "Grouping variable" option to create group-level statistics (e.g., assigning the regional mean income to every household in that region).
*   **Advanced Zero Handling:** Added a **"Treat Zeros as NA"** checkbox. This is critical for mathematical operations like `log()` or `log10()`, preventing infinite values (`-Inf`) by converting zeros to `NA` on the fly (using `dplyr::na_if(., 0)`).
*   **Smart Naming Fixes:** Adjusted the naming pattern logic (`{.col}_{.fn}`) to correctly identify function names even when complex logic (like zero-handling) is applied.
*   **srvyr Structure Fix:** Fixed a bug in the label restoration loop where the plugin tried to access `$variables` (which exists in `survey` objects but not in `srvyr` tibbles). Metadata is now correctly preserved for all object types.

## 🚀 What's New in Version 0.1.3

*   **Preview Generation:** Completely rewrote the preview engine. It now converts the `srvyr` object to a standard data frame *before* subsetting, preventing crashes when previewing complex designs.
*   **Object Assignment Logic:** Fixed core logic to ensure results are assigned safely to the user's chosen object name in the Global Environment.
*   **Label Preservation (Recode):** Fixed metadata copying specifically for the Batch Recode component.

## ✨ Features

### 1. Survey Batch Transform
Apply functions to multiple variables within a design object simultaneously.
*   **Vectorized Operations:** Log, Scale, Exponential, Abs, Sqrt.
*   **Summary Statistics:** Mean, Sum, SD, Variance, Min, Max (New in v0.1.4).
*   **Safety Features:** Options to "Ignore NAs" and "Treat Zeros as NA" (preventing math errors).
*   **Grouped Calculation:** Calculate statistics relative to a group (e.g., centering income *within* a region) using implicit `group_by` -> `mutate` -> `ungroup`.
*   **Smart Naming:** Rename variables automatically using glue syntax (`{.col}_{.fn}`).

### 2. Survey Batch Recode
A spreadsheet-like interface for recoding variables inside a design.
*   **Metadata Awareness:** Automatically copies the RKWard variable label from the source variable to the new recoded variable, keeping your dataset documented.
*   **Type Safety:** Options to strictly handle Numeric vs. Character conversions to prevent R errors.
*   **Default Handling:** Flexible "Else" logic (Copy original, NA, or Specific Value).
*   **Smart Preview:** Displays only the original and the new variable side-by-side for verification.

### 3. Survey Composite Score
Calculate new variables based on row-wise aggregation of items.
*   **Methods:** Mean, Sum, Median, SD, Min/Max, Count (N valid).
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
