import { Request, Response } from 'express';
import Polygon from '../models/Polygon';
import { Sequelize, Op, where } from 'sequelize';

export const createPolygon = async (req: Request, res: Response) => {
  try {
    const { features } = req.body;

    if (!features || features.length === 0) {
      return res.status(400).json({ error: 'Nenhum polígono fornecido' });
    }

    const feature = features[0];

    if (!feature.properties || !feature.properties.name) {
      return res.status(400).json({ error: 'Nome do polígono não fornecido' });
    }
    if (!feature.geometry) {
      return res.status(400).json({ error: 'Geometria do polígono não fornecida' });
    }

    const name = feature.properties.name;
    const properties = feature.properties;

    const geometryLiteral = Sequelize.literal(`
      ST_Transform(
        ST_SetSRID(
          ST_GeomFromGeoJSON('${JSON.stringify(feature.geometry)}'), 
          4326
        ), 
        5880
      )
    `);

    const centroid = Sequelize.literal(`ST_AsGeoJSON(ST_Centroid(${geometryLiteral.val}))`);
    const area_hectares = feature.geometry.type === "Polygon" ? 
    Sequelize.literal(`ST_Area(${geometryLiteral.val}) / 10000`) : 
    null; 
    const polygon = await Polygon.create({
      geometry: centroid ,
      name: name,
      properties: properties,
      centroid: centroid,
      area_hectares: area_hectares,
      userId: req.userId,
    });

    res.status(201).json(polygon);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Erro ao criar polígono' });
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
    const id = req.params.id;
    const polygon = await Polygon.findByPk(id);


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
      attributes: ['id', 'geometry', 'name', 'properties'],
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

    if (!polygon) {
      return res.status(404).json({ error: "Polígono não encontrado" });
    }

    const { features } = req.body;
    const name = features[0].properties.name;
    const geometry = features[0].geometry;
    const properties = features[0].properties;

    const geometryLiteral = Sequelize.literal(`
      ST_SetSRID(
        ST_GeomFromGeoJSON('${JSON.stringify(geometry)}'), 
        5880
      )
    `);
  

    const centroid = Sequelize.literal(`ST_AsGeoJSON(ST_Centroid(${geometryLiteral.val}))`);
    const area_hectares = geometry.type === "Polygon" ? 
      Sequelize.literal(`ST_Area(${geometryLiteral.val}) / 10000`) : 
      null;

    await polygon.update({
      geometry: geometryLiteral,
      name: name,
      properties: properties,
      centroid: centroid,
      area_hectares: area_hectares,
      userId: req.userId,
    });

    res.json(polygon);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Erro ao atualizar polígono" });
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
      attributes: ['id', 'geometry', 'name', 'properties'],
      where: Sequelize.literal(`
        ST_DWithin(
          ST_Transform(geometry, 4326),
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
          ${rad}
        )
      `),
    });
    

    res.json(polygons);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Erro ao buscar polígonos' });
  }
};