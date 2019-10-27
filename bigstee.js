const animate = ({ debug } = { debug: false }) => {
  const master = new TimelineMax();

  master
    .add(appearIn({ id: 'Knob' }))
    .add(appearIn({ id: 'Handle', transformOrigin: '50% 0%' }))
    .add(appearIn({ id: 'Guard', transformOrigin: '50% 0%' }), '-=0.1')
    .add(
      appearIn({
        id: 'Blade',
        transformOrigin: '50% 0%',
        additionalVariant: 'Edge',
        ease: Power3.easeOut,
      }),
      '-=0.1'
    )
    .add(handleLines({ id: 'Handle-Line' }))
    .add(guardLines({ id: 'Guard-Line' }), '-=0.1')
    .add(growRose({ id: 'Rose' }));
  
  if(debug) {
    GSDevTools.create();  
  }
}

const getElements = ({ id, variants }) => {
  const element = `#${id}`;

  return [element, ...variants.map(variant => `${element}-${variant}`)];
};

const appearIn = ({ id, transformOrigin = '50% 50%', additionalVariant, ease }) => {
  const timeline = new TimelineMax({ id });

  const elements = getElements({
    id,
    variants: ['Background', 'Shadow', 'Light', additionalVariant].filter(
      Boolean
    ),
  });

  timeline
    .set(elements, { opacity: 1, scaleY: 0, transformOrigin })
    .to(elements, 0.4, {
      scale: 1,
      ease: ease || Sine.easeOut,
    });

  return timeline;
};

const handleLines = ({ id }) => {
  const timeline = new TimelineMax({ id });

  const [, ...lines] = getElements({
    id,
    variants: ['Head', 'Top', 'Mid', 'Bottom'],
  });

  timeline.set(lines, { drawSVG: '0%', opacity: 1 }).staggerTo(
    lines,
    0.3,
    {
      drawSVG: true,
      ease: Sine.easeOut,
    },
    0.06
  );

  return timeline;
};

const guardLines = ({ id }) => {
  const timeline = new TimelineMax({ id });

  const [element, ...curves] = getElements({ id, variants: ['Left', 'Right'] });

  timeline
    .set(element, {
      drawSVG: '50% 50%',
    })
    .set(curves, {
      drawSVG: '0%',
    })
    .to(element, 0.5, {
      opacity: 1,
      drawSVG: true,
    })
    .set(curves, { opacity: 1 }, '-=0.2')
    .to(
      curves,
      0.5,
      {
        drawSVG: true,
        ease: Sine.easeOut,
      },
      '-=0.1'
    );

  return timeline;
};

const growRose = ({ id }) => {
  const timeline = new TimelineMax({ id });
  const variants = ['Bottom', 'Mid', 'Top', 'Head'];

  const [, ...branches] = getElements({ id: 'Branch', variants });
  const [, ...spines] = getElements({ id: 'Spine', variants });

  const [, ...curves] = getElements({
    id: 'Curve',
    variants: variants.slice(0, 3),
  });

  const [, ...buds] = getElements({
    id: 'Bud',
    variants: variants.slice(1, 3),
  });

  const [, ...petals] = getElements({
    id: 'Petal',
    variants: variants.slice(0, 3),
  });

  variants.reduce((tl, variantName) => {
    const branch = branches.find(name => name.includes(variantName));
    const spine = spines.find(name => name.includes(variantName));
    const curve = curves.find(name => name.includes(variantName));
    const bud = buds.find(name => name.includes(variantName));

    tl
      .addLabel(`Branch${variantName}`)
      .fromTo(
        branch,
        0.5,
        { opacity: 1, drawSVG: '0%' },
        {
          drawSVG: true,
        },
        '-=0.15'
      )
      .fromTo(
        spine,
        0.3,
        { opacity: 1, scale: 0 },
        { scale: 1, ease: Power3.easeOut },
        `Branch${variantName}+=0.3`
      );

    if (bud) {
      tl.fromTo(
        bud,
        0.5,
        { opacity: 1, scale: 0, transformOrigin: '50% 50%' },
        {
          scale: 1,
          ease: Back.easeOut,
        },
        `Branch${variantName}+=0.22`
      );
    }

    if (curve) {
      tl.fromTo(
        curve,
        0.5,
        { opacity: 1, drawSVG: '0%' },
        {
          drawSVG: true,
          ease: Sine.easeOut,
        },
        `Branch${variantName}+=0.3`
      );
    }

    return tl;
  }, timeline);
  
  timeline
    .staggerFromTo(
      petals,
      0.5,
      { transformOrigin: '100% 50%', opacity: 1, scale: 0 },
      {
        scale: 1,
      },
      0.06,
      `BranchHead`
    );

  return timeline;
};

animate();
