import { createSelector } from 'reselect'

const universeX = state => state.universe.worldX
const universeY = state => state.universe.worldY

const universeXSelector = createSelector(
  universeX,
  x => x
)

const universeYSelector = createSelector(
  universeY,
  y => y
)

export {universeX, universeY, universeXSelector, universeYSelector}