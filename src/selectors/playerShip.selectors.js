import { createSelector } from 'reselect'

const shipRotation = state => state.playerShip.rotation

const shipRotationSelector = createSelector(
  shipRotation,
  rotation => rotation
)

export shipRotation;
export shipRotationSelector