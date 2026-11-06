import type { Resolved } from '../timeline/model';
import {
  CATEGORY_LABEL,
  CERTAINTY_BLURB,
  CERTAINTY_LABEL,
  MODE_LABEL,
  NOVEL_COLOR,
  formatRange,
} from '../timeline/format';
import { h } from './dom';
import { primerSections } from './primer';

/** A link out of the app, in a new tab that gets no handle back on this one. */
const outLink = (href: string, text: string) => h('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text);

export function renderAbout(root: HTMLElement, res: Resolved, onClose: () => void): void {
  root.replaceChildren(
    h(
      'div',
      { class: 'dialog-inner' },
      h(
        'header',
        { class: 'dialog-head' },
        h('h2', null, 'Reading the Golden Path'),
        h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: onClose }, '×'),
      ),
      h('section', null, h('h3', null, 'The world of Dune, in brief'), ...primerSections('h4')),
      h(
        'section',
        null,
        h('h3', null, 'Scope'),
        h(
          'p',
          null,
          "Frank Herbert's six novels, Dune (1965) to Chapterhouse: Dune (1985), with Dune's appendices and glossary. Prequels and sequels by other authors, and the Dune Encyclopedia, are left out.",
        ),
      ),
      h(
        'section',
        null,
        h('h3', null, 'How to read it'),
        h(
          'ul',
          { class: 'legend-list' },
          h('li', null, h('span', { class: 'glyph-solid' }), h('b', null, MODE_LABEL.depicted), ': happens in the narrative.'),
          h(
            'li',
            null,
            h('span', { class: 'glyph-cage' }),
            h('b', null, MODE_LABEL.recalled),
            ': reported by an in-universe source, such as the glossary, Irulan\'s histories or Leto II\'s journals.',
          ),
          h('li', null, 'Colour and the tag on each label give the novel it comes from. Size gives how much it matters.'),
          h('li', null, 'Beside the path: where each novel\'s story sits. Hanging under it, optionally: lifespans. Red arcs join statements of Herbert\'s that contradict each other.'),
        ),
        h(
          'ul',
          { class: 'novel-legend' },
          ...res.novels.map((n) =>
            h(
              'li',
              { style: `--c:${NOVEL_COLOR[n.id]}` },
              h('span', { class: 'swatch' }),
              h('span', null, `${n.title} `),
              h('span', { class: 'muted' }, `(${n.published}) · ${formatRange(n.y0, n.y1, n.approx)}`),
            ),
          ),
        ),
      ),
      h(
        'section',
        null,
        h('h3', null, 'How sure each date is'),
        h(
          'ul',
          { class: 'legend-list' },
          ...(['stated', 'derived', 'reckoned'] as const).map((c) =>
            h('li', null, h('span', { class: `badge cert cert-${c}` }, CERTAINTY_LABEL[c]), ' ', CERTAINTY_BLURB[c]),
          ),
        ),
        h(
          'p',
          null,
          'Herbert prints very few years: four B.G. dates in the glossary and the life dates in Appendix IV. Everything after 10193 here is his own stated intervals added up: twelve years to Messiah, nine more to Children, about 3,500 to the God Emperor\'s death, and about 1,500 to Heretics. Fan chronologies print 10219, 13725 or 13728, and 15229 for those points. They reach them by assumptions Herbert doesn\'t make, and they don\'t agree with each other. Herbert also never writes "A.G."; later years are left bare, as they are here.',
        ),
      ),
      h(
        'section',
        null,
        h('h3', null, 'Reckoning: 10193 or 10196?'),
        h(
          'p',
          null,
          'On the page Shaddam IV is deposed at the Battle of Arrakeen (10193). Appendix IV says his reign ended with a regency in Irulan\'s name in 10196. Every later interval counts from that point, so the switch moves every derived date by three years and leaves the stated ones where they are.',
        ),
      ),
      h(
        'section',
        null,
        h('h3', null, 'Controls'),
        h(
          'ul',
          { class: 'keys' },
          h('li', null, h('kbd', null, '←'), h('kbd', null, '→'), ' earlier / later event'),
          h('li', null, h('kbd', null, 'Space'), ' start or stop the tour'),
          h('li', null, h('kbd', null, '/'), ' search'),
          h('li', null, h('kbd', null, 'O'), ' overview · ', h('kbd', null, 'T'), ' story/true scale · ', h('kbd', null, 'R'), ' reckoning'),
          h('li', null, h('kbd', null, 'M'), ' the map of Arrakis, and back'),
          h('li', null, h('kbd', null, 'Esc'), ' close'),
          h('li', null, 'Drag to orbit, right-drag or two fingers to pan, scroll or pinch to zoom.'),
        ),
      ),
      h(
        'section',
        null,
        h('h3', null, 'About'),
        h(
          'dl',
          { class: 'credits' },
          h('dt', null, 'Developer'),
          h('dd', null, 'altf4m88'),
          h('dt', null, 'GitHub'),
          h('dd', null, outLink('https://github.com/altf4m88', '@altf4m88')),
          h('dt', null, 'Instagram'),
          h('dd', null, outLink('https://www.instagram.com/altf4m8/', '@altf4m8')),
        ),
      ),
      h(
        'p',
        { class: 'fineprint' },
        'An unofficial fan project, not affiliated with or endorsed by the Herbert estate or any publisher or studio.',
      ),
    ),
  );
}

export function renderIndex(
  root: HTMLElement,
  res: Resolved,
  isVisible: (id: string) => boolean,
  onPick: (id: string) => void,
  onClose: () => void,
): void {
  const rows = res.events.map((e) =>
    h(
      'tr',
      { class: isVisible(e.id) ? '' : 'is-off' },
      h('td', { class: 'num' }, formatRange(e.y, e.yEnd, e.approx)),
      h(
        'td',
        null,
        h(
          'button',
          {
            class: 'link-btn',
            onclick: () => {
              onPick(e.id);
              onClose();
            },
          },
          e.title,
        ),
      ),
      h(
        'td',
        null,
        h('span', { class: 'swatch', style: `--c:${NOVEL_COLOR[e.novel]}` }),
        ' ',
        res.novels.find((n) => n.id === e.novel)?.short ?? e.novel,
      ),
      h('td', null, MODE_LABEL[e.mode]),
      h('td', null, CERTAINTY_LABEL[e.certainty]),
      h('td', null, CATEGORY_LABEL[e.category]),
    ),
  );
  root.replaceChildren(
    h(
      'div',
      { class: 'dialog-inner wide' },
      h(
        'header',
        { class: 'dialog-head' },
        h('h2', null, `All ${res.events.length} events`),
        h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: onClose }, '×'),
      ),
      h(
        'div',
        { class: 'table-wrap' },
        h(
          'table',
          { class: 'index-table' },
          h(
            'thead',
            null,
            h(
              'tr',
              null,
              h('th', { scope: 'col' }, 'Year'),
              h('th', { scope: 'col' }, 'Event'),
              h('th', { scope: 'col' }, 'Novel'),
              h('th', { scope: 'col' }, 'Source'),
              h('th', { scope: 'col' }, 'Date'),
              h('th', { scope: 'col' }, 'Kind'),
            ),
          ),
          h('tbody', null, ...rows),
        ),
      ),
    ),
  );
}
