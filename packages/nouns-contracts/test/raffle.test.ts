import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { formatUnits } from 'ethers/lib/utils';
import { NounsRaffleV1 } from '../typechain-types';
import { deployNounsRaffleV1 } from './utils';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsRaffle', () => {
  const burnAddress = '0x0000000000000000000000000000000000000000';
  let nounsRaffleV1: NounsRaffleV1;
  let snapshotId: number;
  let deployer: SignerWithAddress;
  let oldies: string;
  let nounders: string;
  let charity1: string;
  let charity2: string;
  let charities: string[];

  before(async () => {
    const [_deployer, _oldies, _nounders, _charity1, _charity2] = await ethers.getSigners();
    deployer = _deployer;
    oldies = _oldies.address;
    nounders = _nounders.address;
    charity1 = _charity1.address;
    charity2 = _charity2.address;
    charities = [charity1, charity2];

    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should draw one of provided addresses or burn', async () => {
    const draw = await nounsRaffleV1.draw();

    expect(draw).to.be.oneOf([burnAddress, oldies, nounders, charity1, charity2]);
  });

  it('should draw 100% burn', async () => {
    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities, 100);

    const draw = await nounsRaffleV1.draw();

    expect(draw).to.equal(burnAddress);
  });

  it('should draw 100% oldies', async () => {
    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities, 0, 100);

    const draw = await nounsRaffleV1.draw();

    expect(draw).to.equal(oldies);
  });

  it('should draw 100% nounders', async () => {
    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities, 0, 0, 100);

    const draw = await nounsRaffleV1.draw();

    expect(draw).to.equal(nounders);
  });

  it('should draw 100% charity', async () => {
    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities, 0, 0, 0, 100);

    const draw = await nounsRaffleV1.draw();

    expect(draw).to.be.oneOf(charities);
  });

  it('should draw 100% charity because probabilities equal 0%', async () => {
    nounsRaffleV1 = await deployNounsRaffleV1(deployer, oldies, nounders, charities, 0, 0, 0, 0);

    const draw = await nounsRaffleV1.draw();

    expect(draw).to.be.oneOf(charities);
  });
});
