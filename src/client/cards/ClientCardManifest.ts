import {CardName} from '@/common/cards/CardName';
import {ALL_CARD_MANIFESTS} from '@/cards/AllCards';
import {CardType} from '@/common/cards/CardType';
import {ICard} from '@/cards/ICard';
import {ICardFactory} from '@/cards/ICardFactory';
import {GameModule} from '@/common/cards/GameModule';
import {IClientCard} from '@/common/cards/IClientCard';
import {PreferencesManager} from '../utils/PreferencesManager';
// @ts-ignore don't turn this into an import.
const cardJson = require('@/genfiles/cards.json');

export type CardAndModule = {card: IClientCard, module: GameModule};
const cards: Map<CardName, CardAndModule> = new Map();
const cardArray: Array<CardAndModule> = [];

export function getCard(cardName: CardName): CardAndModule | undefined {
  return cards.get(cardName);
}

export function getCards(filter: (card: CardAndModule) => boolean): Array<CardAndModule> {
  return cardArray.filter(filter);
}

export function byType(cardType: CardType): (cam: CardAndModule) => boolean {
  return (cam) => cam.card.cardType === cardType;
}

export function byModule(module: GameModule): (cam: CardAndModule) => boolean {
  return (cam) => cam.module === module;
}

export const toName = (cam: CardAndModule) => cam.card.name;

function currentInitialize() {
  ALL_CARD_MANIFESTS.forEach((manifest) => {
    const module = manifest.module;
    [
      manifest.projectCards,
      manifest.corporationCards,
      manifest.preludeCards,
      manifest.standardProjects].forEach((deck) => {
      deck.factories.forEach((cf: ICardFactory<ICard>) => {
        const card: ICard = new cf.Factory();
        const cam = {card, module};
        cards.set(card.name, cam);
        cardArray.push(cam);
      });
    });
  });
}

function newInitialize() {
  (cardJson as any as Array<IClientCard>).forEach((card) => {
    const module = card.module ?? GameModule.Base;
    const cam = {module, card};
    cards.set(card.name, cam);
    cardArray.push(cam);
  });
}

console.log(PreferencesManager.INSTANCE.values().experimental_ui);
if (PreferencesManager.INSTANCE.values().experimental_ui) {
  console.log('new initialize');
  newInitialize();
} else {
  console.log('current initialize');
  currentInitialize();
}
