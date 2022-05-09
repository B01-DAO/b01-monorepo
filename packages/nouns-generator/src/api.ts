import express, { Express, Request } from 'express';
import { param, validationResult } from 'express-validator';
import generate from './generate';

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).send({
      message: 'Nouns API Root',
    });
  });

  app.post(
    '/generate/:tokenId',
    param('tokenId').isInt({ min: 0, max: 1000 }),
    async (req: Request, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      console.log('Generating for token:', req.params.tokenId);

      const tokenId = 0;
      const tokenSeed = {
        volumeCount: 35,
        maxVolumeHeight: 6,
        waterFeatureCount: 8,
        grassFeatureCount: 8,
        treeCount: 5,
        bushCount: 67,
        peopleCount: 19,
        timeOfDay: 1,
        season: 2,
        greenRooftopP: 0,
        siteEdgeOffset: '2731733726',
        orientation: '99040878704',
      };

      generate(tokenId, tokenSeed);

      res.status(200).send({
        message: 'Generating...',
      });
    },
  );

  app.post('/pollAndGenerate', async (req: Request, res) => {
    console.log('Querying for latest Noun without uri');

    // TODO:
    // 1. Query subgraph for Noun without uri
    // 2. Check if generation is happening
    // 3. Run job
  });

  return app;
};
