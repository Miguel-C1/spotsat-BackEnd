import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'polygons',
  timestamps: true,
})
export class Polygon extends Model {
  @Column({
    type: DataType.GEOMETRY('POLYGON', 5880),
    allowNull: false,
  })
  geometry!: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  properties!: object;

  @Column({
    type: DataType.GEOMETRY('POINT', 5880),
    allowNull: false,
  })
  centroid!: object;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  area_hectares!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default Polygon;
