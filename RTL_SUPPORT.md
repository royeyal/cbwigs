# Swiper RTL Support Documentation

## ✅ **RTL Support Features**

The Swiper component now includes comprehensive Right-to-Left (RTL) language support that automatically adapts to the webpage's text direction.

### **Automatic Detection**

The swiper automatically detects RTL direction using multiple methods:

1. **HTML `dir` attribute**: `<html dir="rtl">`
2. **Body `dir` attribute**: `<body dir="rtl">`  
3. **CSS `direction` property**: `direction: rtl`

### **RTL Adaptations**

When RTL is detected, the following adaptations are made:

#### **🔄 Navigation Behavior**
- **Button mapping swapped**: In RTL, left arrow becomes "next" and right arrow becomes "previous"
- **Intuitive navigation**: Maintains expected user behavior regardless of language direction
- **Visual indicators**: Arrow directions are mirrored using CSS transforms

#### **🎨 Visual Styling**
- **Slide spacing**: `padding-right` becomes `padding-left` in RTL
- **Margins**: Last slide margins are adjusted for RTL flow
- **Arrow rotation**: Navigation arrows are visually flipped for RTL

#### **⚡ Swiper Configuration**
- **RTL flag**: `rtl: true` is set automatically when RTL is detected
- **Direction maintained**: Horizontal sliding direction is preserved
- **Module compatibility**: Works with Navigation and Pagination modules

## **🚀 Usage in Webflow**

### **For RTL Websites:**
1. Set your HTML direction: `<html dir="rtl">`
2. Or use CSS: `html { direction: rtl; }`
3. Upload the updated build files
4. Swiper will automatically configure for RTL

### **For Multi-language Sites:**
```javascript
// Dynamic direction switching (if needed)
document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
// Then reinitialize swiper if already loaded
```

## **🧪 Test Pages**

Three test pages are available for validation:

1. **`rtl-test.html`** - Arabic RTL layout with toggle functionality
2. **`ltr-test.html`** - English LTR layout with toggle functionality  
3. **`navigation-test.html`** - General navigation testing

## **📋 RTL Languages Supported**

This implementation works automatically for all RTL languages:
- **Arabic** (العربية)
- **Hebrew** (עברית) 
- **Persian/Farsi** (فارسی)
- **Urdu** (اردو)
- **Kurdish** (کوردی)
- Any other RTL language when `dir="rtl"` is set

## **🔧 Technical Implementation**

### **Detection Function:**
```javascript
function isRTL() {
  const htmlDir = document.documentElement.dir || document.dir;
  const bodyDir = document.body.dir;
  const computedStyle = window.getComputedStyle(document.documentElement);
  const cssDirection = computedStyle.direction;
  
  if (htmlDir) return htmlDir.toLowerCase() === 'rtl';
  if (bodyDir) return bodyDir.toLowerCase() === 'rtl';
  if (cssDirection) return cssDirection.toLowerCase() === 'rtl';
  
  return false;
}
```

### **Swiper Configuration:**
```javascript
const swiper = new Swiper(element, {
  rtl: isRTLLayout,
  navigation: {
    // Buttons are swapped for RTL to maintain intuitive behavior
    nextEl: isRTLLayout ? prevButton : nextButton,
    prevEl: isRTLLayout ? nextButton : prevButton
  }
  // ... other options
});
```

### **CSS Adaptations:**
```css
/* RTL slide spacing */
[dir="rtl"] .swiper-slide,
.swiper-rtl .swiper-slide {
  padding-right: 0;
  padding-left: var(--gap);
}

/* RTL arrow mirroring */
[dir="rtl"] .swiper-navigation__button-arorw,
.swiper-rtl .swiper-navigation__button-arorw {
  transform: scaleX(-1);
}
```

## **✅ Browser Compatibility**

RTL support works in all modern browsers that support:
- CSS `direction` property
- `document.documentElement.dir`
- CSS transforms for visual mirroring

## **🎯 Best Practices**

1. **Set direction at HTML level**: Use `<html dir="rtl">` for best compatibility
2. **Test both directions**: Ensure your content works in both LTR and RTL
3. **Consider content**: Arabic numerals, dates, and some UI elements may need special handling
4. **Font selection**: Ensure your fonts support RTL languages properly

## **📦 File Updates**

**Updated files for RTL support:**
- `src/js/swipeslider.js` - RTL detection and configuration
- `src/styles/swipeslider.css` - RTL-specific CSS rules
- Test pages for validation

**Production files:**
- `dist/js/main.[hash].js` - Includes RTL support (~93KB)
- `dist/css/main.[hash].css` - Includes RTL styles (~17KB)

The RTL support is now fully integrated and ready for production use! 🎉