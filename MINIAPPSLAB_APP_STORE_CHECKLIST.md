# MiniAppsLab — App Store Connect URLs & submission checklist

Updated: 2026-08-27

## Public URLs after deployment

### English
- Marketing / product URL: https://ellez.site/apps/miniappslab/en/
- Privacy Policy URL: https://ellez.site/apps/miniappslab/en/privacy.html
- Support URL: https://ellez.site/apps/miniappslab/en/support.html
- Privacy Choices URL (optional in App Store Connect): https://ellez.site/apps/miniappslab/en/privacy-choices.html
- Terms of Use: https://ellez.site/apps/miniappslab/en/terms.html

### Traditional Chinese
- Product URL: https://ellez.site/apps/miniappslab/zh/
- Privacy Policy URL: https://ellez.site/apps/miniappslab/zh/privacy.html
- Support URL: https://ellez.site/apps/miniappslab/zh/support.html
- Privacy Choices URL: https://ellez.site/apps/miniappslab/zh/privacy-choices.html
- Terms of Use: https://ellez.site/apps/miniappslab/zh/terms.html

## App Store Connect

1. App Privacy → Privacy Policy URL
   - Use the English privacy URL for the primary English localization and the Traditional Chinese URL where localization is available.

2. App Privacy → User Privacy Choices URL
   - Optional. MiniAppsLab now has a page ready for it.

3. Version Information → Support URL
   - Use the MiniAppsLab Support page, not the generic ELLEZ home page.

4. Version Information → Marketing URL
   - Optional, but the MiniAppsLab product page is suitable.

5. License Agreement / EULA
   - MiniAppsLab can use Apple’s Standard EULA unless ELLEZ intentionally wants a Custom EULA.
   - The website Terms of Use page is supplemental and links to Apple’s Standard EULA.

6. App Privacy questionnaire
   - The web privacy policy does NOT replace App Store Connect’s privacy questionnaire.
   - Confirm the actual Xcode project, SDKs, analytics, crash reporting, networking, and permissions before selecting “Data Not Collected” or any data types.
   - Imported user HTML/JavaScript can make its own third-party network requests. Ensure the App Store answers accurately describe data collected by ELLEZ and integrated third-party partners in the shipped app.

7. Account deletion
   - MiniAppsLab currently does not require a MiniAppsLab account, so an in-app account deletion flow is not expected solely for the local-first product described on the website.
   - If accounts/cloud sync are added later, re-check Apple account deletion requirements and update the privacy pages.

8. Support contact completeness
   - The support page currently includes ELLEZ LLC, support email, website, and product URL.
   - Apple’s Support URL documentation says the support site must lead to actual contact information such as legal address, email, and telephone number as required by local law.
   - A legal company address and support phone number were NOT added because they were not provided. Add them to the support pages before submission if required for the storefronts/jurisdictions you target.

## Mini app / executable code review note

MiniAppsLab imports and runs HTML/CSS/JavaScript. Before submission, review the current App Review Guidelines for executable code / mini apps and make sure the shipped behavior and review notes accurately explain:
- projects are selected/imported by the user;
- MiniAppsLab is not installing native iOS binaries;
- what native capabilities, if any, are exposed to imported code;
- whether MiniAppsLab itself offers/distributes any third-party mini apps;
- how potentially unsafe or untrusted code is handled.

Do not claim capabilities on the website or in App Review notes that the shipping binary does not actually provide.
