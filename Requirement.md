# Sorting Visualizer — Project Requirements

## Overview

Build an interactive, animated web-based sorting visualizer that demonstrates six classic sorting algorithms using an animated **bar chart**. Supports a **side-by-side race mode**, **step-through mode**, **custom array input**, and **speed control** — making it both visually impressive and educationally rich.

---

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animation**: CSS transitions on bar heights/colors (no canvas needed — pure DOM)
- **Language**: TypeScript preferred

---

## Sorting Algorithms to Implement

1. **Bubble Sort**
2. **Insertion Sort**
3. **Selection Sort**
4. **Merge Sort**
5. **Quick Sort**
6. **Heap Sort**

Each algorithm must:
- Produce an **ordered array of animation steps** (not mutate state directly)
- Track every **comparison**, **swap**, and **overwrite** as discrete steps
- Be fully decoupled from the UI — pure functions that return steps

---

## Core Features

### 1. Single Algorithm Mode
- User selects one algorithm from a dropdown or tab
- A single bar chart fills the screen
- Hit **Play** → bars animate through the sort
- Shows a **live counter** for: comparisons, swaps, array accesses

### 2. Side-by-Side Race Mode
- User selects **2 to 4 algorithms** to race simultaneously
- Each algorithm gets its own bar chart panel (same initial array)
- All panels animate in sync (same speed, same step cadence)
- First algorithm to finish highlights its panel with a "🏆 Winner" badge
- Great for comparing O(n²) vs O(n log n) algorithms visually

### 3. Step-Through Mode
- Toggle between **Auto Play** and **Step-Through**
- In step-through: `Previous Step` / `Next Step` buttons to advance one step at a time
- Current step is described in a text label:
  - e.g. `"Comparing index 3 (value: 7) and index 4 (value: 2)"`
  - e.g. `"Swapping index 3 and index 4"`
  - e.g. `"Pivot selected: value 5 at index 2"`
- Step counter shown: `Step 24 / 310`

### 4. Custom Array Input
- A text field where user types comma-separated values: `5, 3, 8, 1, 9, 2`
- A **Randomize** button that generates a random array of configurable size (10–200 elements)
- An **Array Size** slider: from 10 to 150 bars
- Validation: reject non-numeric values, clamp values to a visible range

### 5. Speed Control
- A slider with labels: `Slow | Medium | Fast | Blazing`
- Controls the delay between animation steps (e.g. 600ms → 16ms)
- Speed can be changed mid-animation

---

## Bar Chart Visualization

### Bar Rendering
- Each element in the array is a vertical bar
- Bar **height** is proportional to its value
- Bars are rendered as `div` elements with CSS height transitions for smooth animation
- Bars are evenly spaced and fill the available width

### Color Coding (per bar state)
| State | Color |
|---|---|
| Default (unsorted) | Indigo / slate blue |
| Being compared | Yellow / amber |
| Being swapped | Red / orange |
| Pivot element (Quick Sort) | Purple |
| Sorted / in final position | Green |
| Currently selected (Insertion Sort cursor) | Cyan |
| Merge Sort — left/right sub-array | Light blue / light orange |

### Sorted Completion Animation
- When sorting completes, bars sweep green from left to right in a ripple effect — very satisfying

---

## Algorithm Info Panel

Below or beside each bar chart, show a live info card:
- **Algorithm name** + one-line description
- **Time Complexity**: Best / Average / Worst
- **Space Complexity**
- **Stable?**: Yes / No
- **Live stats during animation**:
  - Comparisons: `142`
  - Swaps: `67`
  - Array Accesses: `389`
  - Time elapsed: `1.2s`

---

## Animation Step System

All algorithms must produce a step array before animation begins. Steps drive all UI updates — no algorithm logic runs during animation playback.

### Step Types
```ts
type StepType =
  | 'COMPARE'      // two indices being compared (highlight yellow)
  | 'SWAP'         // two indices being swapped (highlight red)
  | 'OVERWRITE'    // one index being written (e.g. merge sort, insertion sort shift)
  | 'PIVOT'        // pivot selected (Quick Sort)
  | 'SORTED'       // index is now in its final sorted position (highlight green)
  | 'SUBARRAY'     // mark a range as the active sub-array (Merge Sort)

interface AnimationStep {
  type: StepType
  indices: number[]         // which bar indices are involved
  array: number[]           // full array state at this step (snapshot)
  description: string       // human-readable label for step-through mode
  metadata?: Record<string, any>  // extra info (e.g. pivot value, subarray bounds)
}
```

### Playback Engine (`useAnimationPlayer` hook)
- Accepts a `steps: AnimationStep[]` array
- Manages: current step index, play/pause state, speed
- Exposes: `play()`, `pause()`, `reset()`, `nextStep()`, `prevStep()`
- On each step tick, applies the array snapshot + highlights to the bar chart

---

## Layout

### Single Algorithm Mode
```
┌──────────────────────────────────────────────────────┐
│           Sorting Visualizer                         │
├──────────────────────────────────────────────────────┤
│ [Algorithm ▼] [Array Size ──●──] [Speed ──●──]      │
│ [Randomize] [Custom Input...] [Play ▶] [Step Mode]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ▐█▌  ▐██▌ ▐█▌ ▐████▌ ▐██▌ ▐███▌ ▐█▌ ▐██▌          │
│  ▐█▌  ▐██▌ ▐█▌ ▐████▌ ▐██▌ ▐███▌ ▐█▌ ▐██▌          │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Quick Sort — O(n log n) avg | Comparisons: 142      │
│  Swaps: 67 | Step: 24/310 | "Pivot selected: 5"     │
└──────────────────────────────────────────────────────┘
```

### Race Mode Layout
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Bubble Sort    │  Quick Sort     │  Merge Sort     │
│                 │                 │                 │
│  [bar chart]    │  [bar chart]    │  [bar chart]    │
│                 │                 │                 │
│  Swaps: 312     │  Swaps: 48  🏆  │  Swaps: 0       │
│  Done: 2.1s     │  Done: 0.4s     │  Done: 0.6s     │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## User Controls Summary

| Control | Description |
|---|---|
| Algorithm selector | Dropdown or pill tabs for single mode |
| Race mode toggle | Switch to multi-panel race view |
| Algorithm multi-select | Choose 2–4 algorithms for race |
| Array size slider | 10 – 150 bars |
| Randomize button | Generate new random array |
| Custom input | Comma-separated numbers text field |
| Play / Pause | Start or pause animation |
| Reset | Return to unsorted initial state |
| Step Mode toggle | Switch between auto and manual stepping |
| Prev / Next Step | Step-through controls (step mode only) |
| Speed slider | Slow (600ms) → Blazing (8ms) per step |

---

## Edge Cases to Handle

- Custom input with duplicates → allowed, handle gracefully
- Custom input with negative numbers → allowed, normalize bar heights
- Array of size 1 → show "Already sorted" immediately
- Changing algorithm mid-animation → reset and restart
- Race mode: if one algorithm finishes early → keep others running, freeze winner panel in green
- Very fast speed with large array → use `requestAnimationFrame` batching to avoid jank

---

## Algorithm-Specific Visual Notes

### Bubble Sort
- Highlight the two elements being compared as the "bubble" moves right
- Show the sorted boundary growing from the right

### Insertion Sort
- Show the "key" element (being inserted) in a distinct color (cyan)
- Animate it sliding left past larger elements

### Selection Sort
- Highlight the current minimum in a distinct color as it scans
- Flash the swap when minimum is placed

### Merge Sort
- Highlight the active sub-array being merged with a background tint
- Distinctly color left-half and right-half bars during a merge step

### Quick Sort
- Highlight pivot in purple
- Show elements less than pivot and greater than pivot in different tints
- Animate partition happening in place

### Heap Sort
- During heap build phase, highlight the subtree being heapified
- During extraction phase, show the "sorted" section growing from the right

---

## Nice-to-Have (Stretch Goals)

- **Sound**: Play a tone proportional to bar height on each swap (like the classic YouTube sorting videos)
- **Algorithm pseudocode panel**: Show the algorithm's pseudocode with the currently executing line highlighted in sync with animation
- **Export race results**: Show a summary card after race mode with a comparison table
- **Dark / Light mode toggle**

---

## File Structure Suggestion

```
src/
├── components/
│   ├── SortVisualizer.tsx        # Main layout, mode switching
│   ├── BarChart.tsx              # Single animated bar chart
│   ├── RaceMode.tsx              # Multi-panel race layout
│   ├── ControlPanel.tsx          # All user controls
│   ├── AlgorithmInfo.tsx         # Complexity + live stats card
│   └── StepDescription.tsx       # Step-through text label
├── algorithms/
│   ├── bubbleSort.ts
│   ├── insertionSort.ts
│   ├── selectionSort.ts
│   ├── mergeSort.ts
│   ├── quickSort.ts
│   └── heapSort.ts
│   (each exports: `generateSteps(array: number[]): AnimationStep[]`)
├── hooks/
│   ├── useAnimationPlayer.ts     # Playback engine (play/pause/step/speed)
│   └── useRace.ts                # Manages multiple simultaneous animation players
├── types/
│   └── sorting.ts                # AnimationStep, StepType, AlgorithmMeta
├── utils/
│   └── arrayUtils.ts             # randomArray, validateCustomInput, normalizeValues
└── App.tsx
```

---

## Deliverable

A fully working React app that runs with `npm install && npm run dev`, purely client-side, no backend required.