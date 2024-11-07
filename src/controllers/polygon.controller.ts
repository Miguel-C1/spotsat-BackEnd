import { Request, Response } from 'express';
import Polygon from '../models/Polygon';
import { Sequelize, Op, where } from 'sequelize'; // Adjust the path as necessary

export const createPolygon = async (req: Request, res: Response) => {
  try {
    const { features } = req.body;
    if (!features || features.length === 0) {
      return res.status(400).json({ error: 'Nenhum polígono fornecido' });
    }
    if(!features[0].properties.name){
      return res.status(400).json({ error: 'Nome do polígono não fornecido' });
    }
    if(!features[0].geometry){
      return res.status(400).json({ error: 'Geometria do polígono não fornecida' });
    }
    if(!features[0].properties){
      return res.status(400).json({ error: 'Propriedades do polígono não fornecidas' });
    }
    const name = features[0].properties.name;
    const geometry = features[0].geometry;
    const properties = features[0].properties;
    const polygon = await Polygon.create({ geometry: geometry, name: name, properties: properties});
    res.status(201).json(polygon);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error:', error);
    }
    res.status(500).json({ error: 'Erro ao criar polígono:' });
  }
};

export const getPolygons = async (req: Request, res: Response) => {
  try {
    const polygons = await Polygon.findAll();
    res.json(polygons);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar polígonos' });
  }
};

export const getPolygonById = async (req: Request, res: Response) => {
  try {
    const polygon = await Polygon.findByPk(req.params.id);
    if (!polygon) return res.status(404).json({ error: 'Polígono não encontrado' });
    res.json(polygon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar polígono' });
  }
};

export const getPolygonInterests = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const polygon = await Polygon.findByPk(id);

    if (!polygon) {
      return res.status(404).json({ error: 'Polígono não encontrado' });
    }

    const interests = await Polygon.findAll({
      attributes: ['id', 'geometry', 'name'],
      where: {
        id: { [Op.ne]: id },
        [Op.and]: Sequelize.literal(`ST_Contains(ST_GeomFromGeoJSON('${JSON.stringify(polygon.geometry)}'), geometry)`),
      },
    });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pontos de interesse' });
  }
};

export const updatePolygon = async (req: Request, res: Response) => {
  try {
    const polygon = await Polygon.findByPk(req.params.id);
    if (!polygon) return res.status(404).json({ error: 'Polígono não encontrado' });

    const { features } = req.body;
    const name = features[0].properties.name;
    const geometry = features[0].geometry;
    const properties = features[0].properties;
    await polygon.update({ geometry: geometry, name: name, properties: properties });
    res.json(polygon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar polígono' });
  }
};

export const deletePolygon = async (req: Request, res: Response) => {
  try {
    const polygon = await Polygon.findByPk(req.params.id);
    if (!polygon) return res.status(404).json({ error: 'Polígono não encontrado' });

    await polygon.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar polígono' });
  }
};

export const searchPolygons = async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, radius } = req.query;
  
      if (!latitude || !longitude || !radius) {
        return res.status(400).json({ error: 'Parâmetros latitude, longitude e raio são necessários' });
      }
  
      const lat = parseFloat(latitude as string);
      const lon = parseFloat(longitude as string);
      const rad = parseFloat(radius as string);
  
      if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        return res.status(400).json({ error: 'Parâmetros devem ser numéricos' });
      }
  
      const polygons = await Polygon.findAll({
        attributes: ['id', 'geometry', 'name'],
        where: Sequelize.literal(`
          ST_DWithin(
            geometry,
            ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
            ${rad}
          )
        `),
      });
  
      res.json(polygons);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar polígonos' });
    }
  };