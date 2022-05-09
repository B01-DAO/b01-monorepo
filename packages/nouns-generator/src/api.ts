import { BigNumber } from 'ethers';
import express, { Express, Request } from 'express';
import { param, validationResult } from 'express-validator';
import { generateSafe } from './handlers';
import { startListener, stopListener } from './listener';

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
      const tokenSeed = {
        volumeCount: 15,
        maxVolumeHeight: 6,
        waterFeatureCount: 7,
        grassFeatureCount: 5,
        treeCount: 20,
        bushCount: 54,
        peopleCount: 19,
        timeOfDay: 0,
        season: 2,
        greenRooftopP: 0,
        siteEdgeOffset: BigNumber.from('1378562894'),
        orientation: BigNumber.from('20885675686'),
      };
      generateSafe(Number(req.params.tokenId), tokenSeed);

      res.status(200).send({
        message: 'Generating...',
      });
    },
  );

  // app.post('/pollAndGenerate', async (req: Request, res) => {
  //   console.log('Querying for latest Noun without uri');

  //   // TODO:
  //   // 1. Query subgraph for Noun without uri
  //   // 2. Check if generation is happening
  //   // 3. Run job
  // });

  app.post('/startListener', param('start').isBoolean(), async (req: Request, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const start = req.params.start;
    console.log(`${start ? 'Starting' : 'Stopping'} listener`);

    if (start) {
      startListener();
    } else {
      stopListener();
    }
  });

  return app;
};
