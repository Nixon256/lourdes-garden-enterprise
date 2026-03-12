# Version 1.0 Test Cases

## 1. Global Navigation & Header
- **TC_NAV_01**: Verify that the "Our Story" link redirects to `/about`.
- **TC_NAV_02**: Verify that the "Products" link redirects to `/products`.
- **TC_NAV_03**: Verify that the "Gallery" link redirects to `/gallery`.
- **TC_NAV_04**: Verify that the "Contact" link redirects to `/contact`.
- **TC_NAV_05**: Verify that the Logo redirects to the homepage `/`.
- **TC_NAV_06**: Verify that Admin/Login/Logout/Cart buttons are **NOT** visible.

## 2. Dynamic Language & Theme
- **TC_UI_01**: Verify that switching to Tamil updates the navigation text correctly.
- **TC_UI_02**: Verify that toggling Dark Mode applies the `dark` class to the body/html.
- **TC_UI_03**: Verify that the header remains aligned correctly in Tamil mode.

## 3. Products Catalog
- **TC_PROD_01**: Verify that all 5 products (Pepper, Banana, Lemon, Avocado, Black Lemon) are displayed.
- **TC_PROD_02**: Verify that each product has a unique image path and is not broken.
- **TC_PROD_03**: Verify that the "Black Lemon" product is visible under "Value-Added" category.
- **TC_PROD_04**: Verify that filter buttons remain legible in Dark Mode.

## 4. Premium Gallery
- **TC_GAL_01**: Verify that the masonry layout is active (check for columns-1/2/3 classes).
- **TC_GAL_02**: Verify that images have a 24px border radius.
- **TC_GAL_03**: Verify that hovering over an image triggers a scale effect.
- **TC_GAL_04**: Verify that no captions or filters are visible as per the simplification request.

## 5. Contact Form & Backend
- **TC_CON_01**: Verify that submitting the form with valid data shows a success message.
- **TC_CON_02**: Verify that the submission is stored in the database (API returns 201).
- **TC_CON_03**: Verify that mandatory field validation is working (Name, Email, Subject, Message).

## 6. Footer & Contact Info
- **TC_FOOT_01**: Verify that the footer is present on all main pages.
- **TC_FOOT_02**: Verify that the WhatsApp floating button is visible and has a pulse animation.
- **TC_FOOT_03**: Verify that the Google Maps link is functional.
