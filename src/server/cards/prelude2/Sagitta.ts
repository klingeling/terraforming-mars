import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class Sagitta extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.SAGITTA,
      startingMegaCredits: 28,
      type: CardType.CORPORATION,

      behavior: {
        production: {energy: 1, megacredits: 2},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): provide reasonable secondary tag. It's not rendered on CardRenderItemComponent.
          b.megacredits(28).production((pb) => pb.energy(1).megacredits(2)).cards(1, {secondaryTag: AltSecondaryTag.NO_TAGS}).openBrackets.noTags().closeBrackets.br;
          b.effect('When you play a card with no tags, gain 4 M€.', (eb) => eb.noTags().startEffect.megacredits(4)).br;
          b.effect('When you play a card with EXACTLY 1 TAG, gain 1 M€.', (eb) => eb.emptyTag().asterix().startEffect.megacredits(1)).br;
        }),
        description: 'You start with 28 M€. Increase energy production 1 step and M€ production 2 steps. Draw a card with no tags.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.drawCard(1, {include: (c) => c.tags.length === 0});
    return undefined;
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (!player.isCorporation(this.name)) {
      return undefined;
    }

    if (card.tags.length === 0) {
      player.stock.megacredits += 4;
      player.game.log('${0} gained 4 M€ for playing a card with no tags.', (b) => b.player(player));
    }
    if (card.tags.length === 1) {
      player.stock.megacredits += 1;
      player.game.log('${0} gained 1 M€ for playing a card with exactly 1 tag.', (b) => b.player(player));
    }
  }
}
