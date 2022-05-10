import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { formatUnits } from 'ethers/lib/utils';
import { NounsDescriptor, NounsSeeder } from '../typechain-types';
import { deployNounsSeeder, deployNounsDescriptor } from './utils';
import { ethers } from 'hardhat';

chai.use(solidity);
const { expect } = chai;

describe('NounsSeeder', () => {
  let nounsDescriptor: NounsDescriptor;
  let nounsSeeder: NounsSeeder;
  let snapshotId: number;

  before(async () => {
    nounsDescriptor = await deployNounsDescriptor();
    nounsSeeder = await deployNounsSeeder();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should return expected var values', async () => {
    const seed = await nounsSeeder.generateSeed(100, nounsDescriptor.address);
    const {
      volumeCountRange: vcR,
      maxVolumeHeightRange: mvhR,
      waterFeatureCountRange: wfcR,
      grassFeatureCountRange: gfcR,
      treeCountRange: tcR,
      bushCountRange: bcR,
      peopleCountRange: pcR,
      lightingRange: lR,
      seasonRange: sR,
      environmentRange: eR,
      greenRooftopPRange: grpR,
      siteEdgeOffsetRange: seoR,
      orientationRange: oR,
    } = await nounsDescriptor.getAttributeRanges();

    expect(seed.volumeCount).to.be.within(vcR[0], vcR[1]);
    expect(seed.maxVolumeHeight).to.be.within(mvhR[0], mvhR[1]);
    expect(seed.waterFeatureCount).to.be.within(wfcR[0], wfcR[1]);
    expect(seed.grassFeatureCount).to.be.within(gfcR[0], gfcR[1]);
    expect(seed.treeCount).to.be.within(tcR[0], tcR[1]);
    expect(seed.bushCount).to.be.within(bcR[0], bcR[1]);
    expect(seed.peopleCount).to.be.within(pcR[0], pcR[1]);
    expect(seed.lighting).to.be.within(lR[0], lR[1]);
    expect(seed.season).to.be.within(sR[0], sR[1]);
    expect(seed.environment).to.be.within(eR[0], eR[1]);
    expect(seed.greenRooftopP).to.be.within(grpR[0], grpR[1]);

    expect(Number(formatUnits(seed?.siteEdgeOffset, 10)))
      .is.lessThan(Number(formatUnits(seoR[1], 10)))
      .and.is.greaterThan(Number(formatUnits(seoR[0], 10)));

    expect(Number(formatUnits(seed?.orientation, 10)))
      .is.lessThan(Number(formatUnits(oR[1], 10)))
      .and.is.greaterThan(Number(formatUnits(oR[0], 10)));
  });
});
