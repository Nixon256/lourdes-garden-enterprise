export interface GalleryItem {
    id: string
    src: string
    alt: string
    category: 'farm' | 'harvest' | 'products' | 'nature'
    width?: number
    height?: number
}

// Helper to assign random categories for initial setup
// Ideally, these would be manually curated
const categories = ['farm', 'harvest', 'products', 'nature'] as const

export const galleryImages: GalleryItem[] = [
    { id: '1', src: '/images/gallery/1000048587.jpg', alt: 'Farm View', category: 'farm' },
    { id: '2', src: '/images/gallery/1000048589.jpg', alt: 'Lush Greenery', category: 'nature' },
    { id: '3', src: '/images/gallery/1000105006.jpg', alt: 'Fresh Harvest', category: 'harvest' },
    { id: '4', src: '/images/gallery/1000105012.jpg', alt: 'Organic Produce', category: 'products' },
    { id: '5', src: '/images/gallery/1000105027.jpg', alt: 'Farm Life', category: 'farm' },
    { id: '6', src: '/images/gallery/1000105030.jpg', alt: 'Nature\'s Bounty', category: 'nature' },
    { id: '7', src: '/images/gallery/1000105033.jpg', alt: 'Sustainable Farming', category: 'farm' },
    { id: '8', src: '/images/gallery/1000142656.jpg', alt: 'Quality Produce', category: 'products' },
    { id: '9', src: '/images/gallery/1000142659.jpg', alt: 'Freshly Picked', category: 'harvest' },
    { id: '10', src: '/images/gallery/20210203_091218.jpg', alt: 'Morning at the Farm', category: 'farm' },
    { id: '11', src: '/images/gallery/20210203_110520.jpg', alt: 'Green Fields', category: 'nature' },
    { id: '12', src: '/images/gallery/20210203_115318.jpg', alt: 'Harvest Time', category: 'harvest' },
    { id: '13', src: '/images/gallery/20210203_115401.jpg', alt: 'Premium Quality', category: 'products' },
    { id: '14', src: '/images/gallery/20210203_124619.jpg', alt: 'Farm Operations', category: 'farm' },
    { id: '15', src: '/images/gallery/20210203_124650.jpg', alt: 'Natural Growth', category: 'nature' },
    { id: '16', src: '/images/gallery/20210203_130308.jpg', alt: 'Bountiful Harvest', category: 'harvest' },
    { id: '17', src: '/images/gallery/20210203_141557.jpg', alt: 'Product Showcase', category: 'products' },
    { id: '18', src: '/images/gallery/20210203_141600.jpg', alt: 'Farm Landscape', category: 'farm' },
    { id: '19', src: '/images/gallery/20210820_095720.jpg', alt: 'Seasonal Crops', category: 'nature' },
    { id: '20', src: '/images/gallery/20220507_182730.jpg', alt: 'Sunset at Farm', category: 'farm' },
    { id: '21', src: '/images/gallery/20220507_204801.jpg', alt: 'Evening Glow', category: 'nature' },
    { id: '22', src: '/images/gallery/20220507_204810.jpg', alt: 'Night Farming', category: 'farm' },
    { id: '23', src: '/images/gallery/20220508_064837.jpg', alt: 'Early Morning', category: 'nature' },
    { id: '24', src: '/images/gallery/20220508_064850.jpg', alt: 'Fresh Dew', category: 'nature' },
    { id: '25', src: '/images/gallery/20220508_105652.jpg', alt: 'Field Work', category: 'farm' },
    { id: '26', src: '/images/gallery/20220508_105822.jpg', alt: 'Rich Soil', category: 'nature' },
    { id: '27', src: '/images/gallery/20220508_105833.jpg', alt: 'Growing Strong', category: 'farm' },
    { id: '28', src: '/images/gallery/20240127_120158.jpg', alt: 'Modern Techniques', category: 'farm' },
    { id: '29', src: '/images/gallery/20240127_120159.jpg', alt: 'Sustainable Practices', category: 'nature' },
    { id: '30', src: '/images/gallery/20240127_120759.jpg', alt: 'Yield Inspection', category: 'harvest' },
    { id: '31', src: '/images/gallery/20240127_125220.jpg', alt: 'Sorting & Grading', category: 'products' },
    { id: '32', src: '/images/gallery/20240127_143743.jpg', alt: 'Packing Process', category: 'products' },
    { id: '33', src: '/images/gallery/20240127_143837.jpg', alt: 'Ready for Dispatch', category: 'products' },
    { id: '34', src: '/images/gallery/20250517_091129.jpg', alt: 'Future Farming', category: 'farm' },
    { id: '35', src: '/images/gallery/20250517_095529.jpg', alt: 'Innovation in Ag', category: 'nature' },
    { id: '36', src: '/images/gallery/20250517_095546.jpg', alt: 'Precision Agriculture', category: 'farm' },
    { id: '37', src: '/images/gallery/20250517_104416.jpg', alt: 'Healthy Crops', category: 'products' },
    { id: '38', src: '/images/gallery/20250517_110356.jpg', alt: 'Abundant Yield', category: 'harvest' },
    { id: '39', src: '/images/gallery/20250517_110413.jpg', alt: 'Quality Check', category: 'products' },
    { id: '40', src: '/images/gallery/20250517_110507.jpg', alt: 'Farm Fresh', category: 'products' },
    { id: '41', src: '/images/gallery/20250517_110510.jpg', alt: 'Organic Certification', category: 'nature' },
    { id: '42', src: '/images/gallery/20250517_110512.jpg', alt: 'Export Quality', category: 'products' },
    { id: '43', src: '/images/gallery/20250517_110807.jpg', alt: 'Global Standards', category: 'products' },
    { id: '44', src: '/images/gallery/20250517_115040.jpg', alt: 'Team Work', category: 'farm' },
    { id: '45', src: '/images/gallery/20250517_115059.jpg', alt: 'Community Support', category: 'nature' },
    { id: '46', src: '/images/gallery/20250517_121917.jpg', alt: 'Harvest Celebration', category: 'harvest' },
    { id: '47', src: '/images/gallery/20250517_131604.jpg', alt: 'Tradition & Tech', category: 'farm' },
    { id: '48', src: '/images/gallery/20250517_135957.jpg', alt: 'Pure Nature', category: 'nature' },
    { id: '49', src: '/images/gallery/20250517_154236.jpg', alt: 'Eco Friendly', category: 'nature' },
    { id: '50', src: '/images/gallery/20250517_165531.jpg', alt: 'Green Revolution', category: 'farm' },
    { id: '51', src: '/images/gallery/20250517_165543.jpg', alt: 'Sustainable Future', category: 'nature' },
    { id: '52', src: '/images/gallery/20250517_165551.jpg', alt: 'Farm to Fork', category: 'products' },
    { id: '53', src: '/images/gallery/20250517_171438.jpg', alt: 'Freshness Guaranteed', category: 'products' },
    { id: '54', src: '/images/gallery/20251227_122551.jpg', alt: 'Winter Harvest', category: 'harvest' },
    { id: '55', src: '/images/gallery/20251227_122559.jpg', alt: 'Cold Storage', category: 'farm' },
    { id: '56', src: '/images/gallery/20251227_122616.jpg', alt: 'Logistics', category: 'farm' },
    { id: '57', src: '/images/gallery/20251227_122620.jpg', alt: 'Global Shipping', category: 'products' },
    { id: '58', src: '/images/gallery/20251227_122733.jpg', alt: 'Supply Chain', category: 'farm' },
    { id: '59', src: '/images/gallery/20251227_152615.jpg', alt: 'Customer Satisfaction', category: 'products' },
]
