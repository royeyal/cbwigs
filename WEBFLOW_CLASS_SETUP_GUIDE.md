# Webflow Class Setup Guide for YouTube Player

## Quick Reference: Webflow Designer Settings

### Class: `youtube-player`

Use these exact settings in the Webflow Style Panel:

#### 📐 Layout
```
Position: Relative
Display: Block
Width: 100%
```

#### 📏 Size
```
Height: Auto
Min Height: 300px
```
> **Why?** The aspect ratio is controlled by CSS, but min-height ensures visibility in the Designer.

#### 📦 Spacing
```
Padding: 0px (all sides)
Margin: 0px (or as needed for your layout)
```

#### 🎨 Style
```
Background Color: #000000 (Black)
Border Radius: 12px
```

#### 🔧 Effects
```
Overflow: Hidden
```
> **Important!** This prevents the play button from showing outside the container.

#### ✨ Advanced (Optional)
```
Box Shadow: 0px 8px 32px rgba(0, 0, 0, 0.3)
```
> Adds subtle elevation effect

---

### Combo Class: `youtube-player youtube-short`

**Add these additional settings for YouTube Shorts:**

#### 📏 Size
```
Max Width: 400px
```

#### 📦 Spacing
```
Margin Left: Auto
Margin Right: Auto
```
> Centers the vertical video player

---

## Step-by-Step Visual Guide

### 1. Create the Div Block

1. Click the "+" icon or press `A`
2. Select "Div Block"
3. Click on the div to select it

### 2. Add the Class

1. In the Style Panel (right sidebar), find the "Selector" field at the top
2. Type: `youtube-player`
3. Press Enter

### 3. Set Layout Properties

**In the Style Panel:**

1. Click the **Layout** section
2. Set **Position** → Click "Relative"
3. **Display** should be "Block" (default)
4. Set **Width** → Type `100` and select `%`

### 4. Set Size Properties

1. Click the **Size** section
2. **Height** → Leave as "Auto"
3. **Min H** (Min Height) → Type `300` and select `px`

### 5. Set Spacing

1. Click the **Spacing** section
2. Click the padding lock icon to unlock individual sides
3. Set all padding to `0px`
4. Set margin as needed (usually `0px` or leave default)

### 6. Set Style Properties

1. Click the **Style** section (paint bucket icon)
2. **Background** → Click and select black (#000000)
3. **Border** → Radius: Type `12` for all corners

### 7. Set Overflow

1. Scroll down in Style Panel to **Effects**
2. Find **Overflow** → Select "Hidden" from dropdown

### 8. Add Custom Attribute

1. With the div selected, open **Element Settings** (gear icon in top toolbar)
2. Scroll to **Custom Attributes**
3. Click "+ Add Custom Attribute"
4. Name: `data-youtube-id`
5. Value: Your YouTube video ID (e.g., `dQw4w9WgXcQ`)

### 9. For YouTube Shorts Only

If creating a Shorts player:

**Option A - Using Attribute:**
1. In Element Settings → Custom Attributes
2. Add another attribute
3. Name: `data-youtube-short`
4. Value: (leave empty)

**Option B - Using Combo Class (Recommended):**
1. In Style Panel, with `youtube-player` already added
2. Type a space, then type: `youtube-short`
3. Press Enter
4. With the combo class selected:
   - Size → Max Width: `400px`
   - Spacing → Margin Left: `Auto`
   - Spacing → Margin Right: `Auto`

---

## What You'll See in Webflow Designer

### Regular Video Player
- Black rectangle with rounded corners
- Aspect ratio approximately 16:9 (but shows min-height of 300px)
- Centered text overlay: "YouTube Video (16:9)"
- Semi-transparent label with blur effect

### YouTube Shorts Player
- Narrow black rectangle (max 400px wide)
- Centered on the canvas
- Aspect ratio approximately 9:16
- Centered text overlay: "YouTube Short (9:16)"

### Published Site
- Placeholder disappears automatically
- Video thumbnail appears
- Glassy play button in center
- Smooth hover effects
- Clicking loads and plays the video

---

## Common Webflow-Specific Tips

### ✅ DO:
- Use **Relative** positioning for the container
- Set **Min Height** for Designer visibility
- Use **Hidden** overflow
- Keep padding at `0px`
- Use black background for best contrast
- Create a **Webflow Component** for reusability

### ❌ DON'T:
- Don't use Flexbox or Grid on the `youtube-player` class
- Don't add child elements inside the div (they'll be replaced)
- Don't set a fixed height (use min-height instead)
- Don't use absolute positioning
- Don't add transforms or rotations

---

## Creating Reusable Components

### Best Practice Workflow:

1. **Create and style one perfect player**
   - Follow all steps above
   - Test in Preview mode
   - Verify it works correctly

2. **Convert to Component**
   - Right-click the `youtube-player` div
   - Select "Create Component"
   - Name: "YouTube Player" or "YouTube Short"

3. **Add Component Property**
   - With component selected, click "Create Property"
   - Name: `videoId`
   - Type: Text
   - Default: `dQw4w9WgXcQ`

4. **Bind the Property**
   - Select the component instance
   - Click the "+" next to `data-youtube-id` in Element Settings
   - Choose "Get text from videoId"

5. **Use the Component**
   - Drag component from Assets panel
   - Change `videoId` property for each instance
   - No need to manually edit attributes!

---

## Designer Preview vs Published Site

### In Webflow Designer:
- Shows placeholder label
- Video thumbnail may not appear
- Play button not interactive
- Used for layout and design only

### In Webflow Preview Mode:
- Shows video thumbnail
- Shows glassy play button
- Button has hover effects
- Clicking plays the video (uses YouTube IFrame)

### On Published Site:
- Identical to Preview mode
- Full functionality enabled
- Lazy loading for performance
- All accessibility features active

---

## Troubleshooting Webflow-Specific Issues

### Player too small in Designer?
**Solution:** Increase the **Min Height** setting (try 400px or 500px)

### Player stretching weirdly?
**Solution:** Check that **Position is Relative** and **Overflow is Hidden**

### Can't see the placeholder label?
**Solution:** 
1. Ensure custom CSS is in **Head Code**
2. Check background is black (#000000)
3. Refresh the Designer

### Component property not working?
**Solution:**
1. Verify property is named exactly `videoId`
2. Check binding is set to `data-youtube-id` attribute
3. Make sure attribute exists before creating component

### Play button appearing outside container?
**Solution:** Set **Overflow to Hidden** in the Effects section

---

## Quick Copy-Paste Checklist

Print this and keep it handy:

```
☐ Add Div Block
☐ Class: youtube-player
☐ Position: Relative
☐ Width: 100%
☐ Min Height: 300px
☐ Padding: 0px all sides
☐ Background: #000000
☐ Border Radius: 12px
☐ Overflow: Hidden
☐ Attribute: data-youtube-id = [YOUR_VIDEO_ID]
☐ (Optional for Shorts) Attribute: data-youtube-short
☐ (Optional for Shorts) Max Width: 400px, Margin: Auto
```

---

**Pro Tip:** Create two separate components - one for regular videos and one for Shorts. This makes it even easier to use them throughout your Webflow project!
