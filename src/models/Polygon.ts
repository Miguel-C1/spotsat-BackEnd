import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'polygons',
  timestamps: true,
})
export class Polygon extends Model {
  @Column({
    type: DataType.GEOMETRY('POLYGON', 4326),
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
}

export default Polygon;
