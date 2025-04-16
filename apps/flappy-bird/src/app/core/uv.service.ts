import { Vector4 } from '@babylonjs/core';
import { injectable } from 'inversify';

@injectable()
export class UvService {
  public readonly uvColumns = 5;
  public readonly uvRows = 13;

  public getUVs(column: number, row: number) {
    const decrementedColumn = column - 1;
    const decrementedRow = row - 1;
    const columnSlice = 1 / this.uvColumns;
    const rowSlice = 1 / this.uvRows;
    const bottomLeftU = decrementedColumn * columnSlice;
    const bottomLeftV = decrementedRow * rowSlice;
    const topRightU = (decrementedColumn + 1) * columnSlice;
    const topRightV = (decrementedRow + 1) * rowSlice;

    return new Vector4(bottomLeftU, bottomLeftV, topRightU, topRightV);
  }
}
