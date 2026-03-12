/**
 * Analytics utility for Lourdes Garden
 * Wraps GA4 gtag events for consistent event tracking
 */

// Track any custom event
export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, params)
    }
}

// ─── Conversion Events ──────────────────────────────────────────────────────

/** Fire when the enquiry/contact form is successfully submitted */
export const trackEnquirySubmission = (formLocation: string = 'contact_page') => {
    trackEvent('generate_lead', {
        event_category: 'B2B Conversion',
        event_label: 'Enquiry Form Submission',
        form_location: formLocation,
        currency: 'INR',
        value: 1
    })
}

/** Fire when user clicks the WhatsApp button/link */
export const trackWhatsAppClick = (location: string = 'floating_button') => {
    trackEvent('click_to_whatsapp', {
        event_category: 'B2B Conversion',
        event_label: 'WhatsApp Intent',
        click_location: location
    })
}

/** Fire when user clicks a phone number link */
export const trackPhoneClick = (location: string = 'contact_page') => {
    trackEvent('click_to_call', {
        event_category: 'B2B Conversion',
        event_label: 'Phone Call Intent',
        click_location: location
    })
}

/** Fire when user clicks an email link */
export const trackEmailClick = (location: string = 'footer') => {
    trackEvent('click_to_email', {
        event_category: 'B2B Conversion',
        event_label: 'Email Intent',
        click_location: location
    })
}

/** Fire when user clicks a product "Enquire Now" button */
export const trackProductEnquiry = (productName: string) => {
    trackEvent('view_item', {
        event_category: 'Product Interest',
        event_label: productName,
        item_name: productName
    })
}
