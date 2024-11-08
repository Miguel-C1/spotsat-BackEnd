import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
}

export default Polygon;
