# rk.survey.wrangling: Tidy Manipulation of Complex Surveys

![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)
![RKWard](https://img.shields.io/badge/Platform-RKWard-green)
[![R Linter](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml/badge.svg)](https://github.com/AlfCano/rk.survey.wrangling/actions/workflows/lintr.yml)

**rk.survey.wrangling** extends RKWard's capabilities to handle complex survey designs (`svydesign` objects). It leverages the `{srvyr}` package to apply modern, "tidy" manipulation verbs (like `mutate`, `group_by`, and `across`) to survey data while automatically preserving sampling weights, stratification, and variance estimation parameters.

## 🚀 What's New in Version 0.1.0

This is the first major release of the package. It mirrors the functionality of `rk.data.wrangling` but is strictly specialized for **Survey Design Objects**.

### Key Highlights
1.  **Srvyr Integration:** All operations use `as_survey()` to ensure transformations are statistically safe for complex designs.
2.  **Metadata Preservation:** When recoding variables, the plugin attempts to copy RKWard variable labels (`.rk.meta`) from the original variable to the new one, keeping your dataset documented.
3.  **Performance:** Includes a smart **Live Preview** that processes only a subset of the data (50 rows) to give instant feedback on complex survey calculations.

### 🌍 Internationalization
The interface is fully localized in:
*   🇺🇸 English (Default)
*   🇪🇸 Spanish (`es`)
*   🇫🇷 French (`fr`)
*   🇩🇪 German (`de`)
*   🇧🇷 Portuguese (Brazil) (`pt_BR`)

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

## ✍️ Author & License

*   **Author:** Alfonso Cano (<alfonso.cano@correo.buap.mx>)
*   **Assisted by:** Gemini, a large language model from Google.
*   **License:** GPL (>= 3)
