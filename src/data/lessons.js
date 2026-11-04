export const pathways = [
  {
    id: "welcome",
    title: "Welcome to NOVA!",
    subtitle: "Small steps. A brighter financial future.",
    icon: "compass",
    color: "mint",
    duration: "6 min",
    description:
      "Find your feet, set a goal, and make your first learning win.",
    nodes: ["start", "stars", "goals"],
  },
  {
    id: "investments",
    title: "Types of Investments",
    subtitle: "Get to know the building blocks.",
    icon: "chart",
    color: "blue",
    duration: "28 min",
    description:
      "From your very first share to a diversified mix. Explore seven ways to put money to work.",
    nodes: [
      "overview",
      "stocks",
      "bonds",
      "mutual-funds",
      "etfs",
      "real-estate",
      "gics",
    ],
  },
  {
    id: "styles",
    title: "Investment Styles",
    subtitle: "Find the approach that fits your goals.",
    icon: "target",
    color: "peach",
    duration: "18 min",
    description:
      "Compare approaches, understand risk, and give long-term thinking a try.",
    nodes: ["active-passive", "risk", "time", "diversification", "long-term"],
  },
  {
    id: "media",
    title: "Media Literacy and Fraud",
    subtitle: "Pause. Check. Then decide.",
    icon: "shield",
    color: "lavender",
    duration: "8 min",
    description:
      "Build your money-claim radar with fictional social posts and a source-checking challenge.",
    nodes: ["claims"],
  },
];
export const PATHWAYS = pathways;
const q = (id, type, text, options, answer, explanation, concept) => ({
  id,
  type,
  text,
  options,
  answer,
  explanation,
  concept,
});
export const stockQuestions = [
  q(
    "ownership",
    "multiple",
    "What does owning a stock represent?",
    [
      "A loan to the company.",
      "A share of ownership in the company.",
      "A fixed-income investment.",
    ],
    1,
    "A stock is a small piece of ownership, called a share. You participate in a company’s ups and downs; you are not lending it money.",
    "Stock ownership",
  ),
  q(
    "uncertainty",
    "boolean",
    "Stocks are guaranteed to increase in value over time.",
    ["True", "False"],
    1,
    "Stock prices can rise or fall. Even successful companies can lose value, and past performance never guarantees a future return.",
    "Investment risk",
  ),
  q(
    "rights",
    "multiple",
    "What right might a shareholder have?",
    [
      "The right to vote on company decisions.",
      "Guaranteed annual dividends.",
      "A fixed return on your investment.",
    ],
    0,
    "Some share classes carry voting rights, for example on directors. Rights depend on the share class. Dividends and returns are not guaranteed.",
    "Shareholder rights",
  ),
  q(
    "share",
    "blank",
    "Owning a stock means you own a ___ in the company.",
    ["Loan", "Share", "Dividend", "Contract"],
    1,
    "A share is one unit of company ownership. Imagine a company divided into 100 equal pieces: one piece is one share.",
    "Stock ownership",
  ),
];
export const lessons = {
  start: {
    title: "Your first step",
    eyebrow: "Welcome to NOVA!",
    description:
      "This is your space to practise money decisions before real money is involved.",
    overview:
      "Home brings your next lesson into focus. Learn builds the basics, Simulate is a practice playground, and Discover helps you find educational opportunities. Your demo progress stays on this device.",
    example:
      "You have five minutes between classes. Open Home, choose Continue Learning, and finish one knowledge check. You can close NOVA and resume where you left off.",
    takeaway: "You do not need investing experience to start.",
    questions: [
      q(
        "navigation",
        "multiple",
        "Where can you practise a trade without using real money?",
        ["Discover", "Simulate", "Settings"],
        1,
        "Simulate has a separate pretend wallet. You never connect a bank account in this demo.",
        "App navigation",
      ),
    ],
  },
  stars: {
    title: "A little progress adds up",
    eyebrow: "Welcome to NOVA!",
    description:
      "NOVA Stars celebrate learning, reasoning, and taking the next step.",
    overview:
      "Earned Stars are learning rewards. They can activate challenges, but they cannot be bought, cashed out, or transferred. Your simulator has its own trading Stars. Making a profitable trade does not add earned Stars.",
    example:
      "You finish Basics of Stocks and receive 50 earned Stars once. Your separate 5,000-Star trading wallet is unchanged. A lesson retry helps you learn without farming the same reward.",
    takeaway: "Earned Stars and trading Stars are two separate balances.",
    questions: [
      q(
        "wallets",
        "boolean",
        "A simulated trading profit increases your earned Stars.",
        ["True", "False"],
        1,
        "Trading Stars stay inside the sandbox. Earned Stars come from demonstrated learning.",
        "Learning rewards",
      ),
    ],
  },
  goals: {
    title: "Give your learning a direction",
    eyebrow: "Welcome to NOVA!",
    description: "A concrete goal makes your next step easier to choose.",
    overview:
      "Start with what matters to you: a first car, education costs, everyday confidence, or understanding investing. Consider when you will need the money. A near-term goal usually calls for more attention to stability and access.",
    example:
      "Maya hopes to buy a used car next year. Before chasing a stock tip, she compares how much she can save each month and what happens if an investment falls just before she needs the money.",
    takeaway: "Your goal and time horizon matter more than a trending tip.",
    questions: [
      q(
        "goal",
        "multiple",
        "Which is the clearest starting goal?",
        [
          "Get rich quickly",
          "Save 1,200 for school supplies over 12 months",
          "Buy whatever is trending",
        ],
        1,
        "An amount and a timeline help you compare options and make a realistic plan.",
        "Money goals",
      ),
    ],
  },
  overview: {
    title: "Your investment toolkit",
    eyebrow: "Types of Investments",
    description:
      "Different investments do different jobs. Learn what you own, how you might earn, and what you could lose.",
    overview:
      "A stock is company ownership. A bond is a loan to an issuer. Funds pool investments. Real estate involves property. A GIC is a deposit for a term under an agreement. Each has different risk, cost, and access to money.",
    example:
      "Noah needs part of his money for tuition next September and is practising with the rest for a distant goal. He compares stability, access, and potential loss rather than looking only at the highest advertised return.",
    takeaway:
      "Ask three things: what do I own, how could I earn, and what could go wrong?",
    questions: [
      q(
        "toolkit",
        "multiple",
        "What should you compare before choosing an investment?",
        [
          "Only last year’s return",
          "Risk, costs, access, and your timeline",
          "Which has the best logo",
        ],
        1,
        "Returns are only one part. Risk, costs, liquidity, and your own goals affect the fit.",
        "Investment comparison",
      ),
    ],
  },
  stocks: {
    title: "Basics of Stocks",
    eyebrow: "Types of Investments",
    description: "Meet the small share with a big idea: ownership.",
    overview:
      "A share is a small piece of a company. Its market price changes as buyers and sellers react to new information and expectations. You might gain from a rising price or receive a dividend, but either can disappoint.",
    example:
      "A fictional company has 100 shares. You buy 2 shares for 20 Stars each, owning 2% of the company. At 18 Stars per share, your shares are worth 36 Stars: an unrealised loss of 4 Stars. Selling would realise that loss.",
    takeaway:
      "You own a share of the business, and the value can go down as well as up.",
    questions: stockQuestions,
  },
  bonds: {
    title: "Bonds",
    eyebrow: "Types of Investments",
    description: "Lend to an issuer. Understand the promise and the risk.",
    overview:
      "When you buy a bond, you lend to a government or company. The terms describe interest and repayment. Issuers can fail to pay, and a bond’s resale price can change when interest rates or credit conditions change.",
    example:
      "A fictional one-year bond costs 100 Stars and promises 4 Stars of interest at maturity. If the issuer pays as agreed, you receive 104 Stars. Selling early may produce a different amount.",
    takeaway: "A promised payment is not the same as a risk-free payment.",
    questions: [
      q(
        "bond-loan",
        "multiple",
        "A bond most directly represents…",
        [
          "Ownership of a company",
          "A loan to an issuer",
          "A guaranteed stock gain",
        ],
        1,
        "A bondholder lends to an issuer under stated terms rather than owning company shares.",
        "Bond basics",
      ),
      q(
        "bond-risk",
        "boolean",
        "A bond’s resale price can fall.",
        ["True", "False"],
        0,
        "Changing interest rates and the issuer’s financial health can affect a bond’s market price.",
        "Bond risk",
      ),
    ],
  },
  "mutual-funds": {
    title: "Mutual Funds",
    eyebrow: "Types of Investments",
    description: "Pool money with other investors to hold a collection.",
    overview:
      "A mutual fund pools investors’ money into a portfolio. A manager follows its stated strategy. Investors own units of the fund. Holdings, fees, and concentration vary, so a fund is not automatically diverse or low-risk.",
    example:
      "A fictional fund holds 30 companies. You buy 100 Stars of fund units. If the holdings gain 5% before costs and the example annual cost is 2%, the rough one-year net gain is 3 Stars. Actual fee calculations can differ.",
    takeaway: "Read what the fund holds and what it costs.",
    questions: [
      q(
        "fund-fees",
        "multiple",
        "Why compare a fund’s fees?",
        [
          "They can reduce what you keep",
          "They guarantee better returns",
          "They remove market risk",
        ],
        0,
        "Fees lower the return you keep. A higher fee does not guarantee better results.",
        "Fund costs",
      ),
    ],
  },
  etfs: {
    title: "ETFs",
    eyebrow: "Types of Investments",
    description: "A basket of investments that trades on an exchange.",
    overview:
      "An exchange-traded fund holds a portfolio and its units trade during market hours. Some track an index; others use active strategies. A broad ETF can spread exposure, while a narrow sector ETF can stay concentrated.",
    example:
      "A fictional broad-market ETF holds 200 companies. One company falls 10%, but that does not mean the entire ETF falls 10%. Each holding’s weight and the other holdings affect the result.",
    takeaway: "A basket can spread risk, but it does not eliminate loss.",
    questions: [
      q(
        "etf-diverse",
        "boolean",
        "Every ETF is equally diversified.",
        ["True", "False"],
        1,
        "An ETF focused on a single sector may be much more concentrated than a broad-market fund. Look at its holdings.",
        "ETF diversification",
      ),
    ],
  },
  "real-estate": {
    title: "Real Estate",
    eyebrow: "Types of Investments",
    description: "Property can produce income, costs, and surprises.",
    overview:
      "Direct property ownership can earn rent or a gain on sale, but requires capital and ongoing costs. Maintenance, vacancies, financing costs, and property-price changes affect results. Selling can take time. A REIT is a different way to gain property exposure.",
    example:
      "A fictional rental earns 1,500 Stars per month, with 1,100 Stars of regular costs. A 900-Star repair turns that month’s 400-Star surplus into a 500-Star shortfall.",
    takeaway: "Rental income is not the same as profit.",
    questions: [
      q(
        "property-costs",
        "multiple",
        "Which can reduce a rental property’s profit?",
        [
          "Repairs and vacancies",
          "Only the purchase date",
          "Nothing after you buy",
        ],
        0,
        "Maintenance, empty periods, insurance, financing, and other costs all matter.",
        "Property risk",
      ),
    ],
  },
  gics: {
    title: "GICs",
    eyebrow: "Types of Investments",
    description: "Understand the term before tying up your money.",
    overview:
      "A guaranteed investment certificate is a deposit for an agreed term. A simple fixed-rate GIC pays an agreed rate if held under its terms. Early access may be limited. Eligibility for deposit insurance depends on the issuer, product, and coverage rules.",
    example:
      "A fictional one-year GIC accepts 1,000 Stars at 3% simple annual interest. At maturity it pays 1,030 Stars. If prices rose 4% in that year, the money buys less despite the positive nominal return.",
    takeaway: "Check access, the issuer, coverage, and inflation.",
    questions: [
      q(
        "gic-access",
        "multiple",
        "What should you check if you might need the money early?",
        ["The logo", "Early withdrawal terms", "Yesterday’s stock chart"],
        1,
        "Some GICs cannot be redeemed early. Check the specific terms before committing.",
        "GIC terms",
      ),
    ],
  },
  "active-passive": {
    title: "Active or passive?",
    eyebrow: "Investment Styles",
    description: "Two approaches. Different trade-offs.",
    overview:
      "An active approach selects investments to try to meet a strategy or outperform a comparison. A passive approach aims to track an index. Both involve risk. Compare fees, time, diversification, and how well the approach fits your goal.",
    example:
      "Aria compares a fictional actively managed fund charging 1.8% annually with an index fund charging 0.2%. Similar gross returns would leave different net results. Neither return is guaranteed.",
    takeaway: "Understand the strategy and its costs before comparing results.",
    questions: [
      q(
        "passive",
        "multiple",
        "A passive index strategy usually aims to…",
        [
          "Track a stated index",
          "Guarantee a gain every week",
          "Predict tomorrow’s best stock",
        ],
        0,
        "Tracking an index is the objective. Market losses and tracking differences can still occur.",
        "Passive investing",
      ),
    ],
  },
  risk: {
    title: "Know your comfort with risk",
    eyebrow: "Investment Styles",
    description: "Ability to take a loss and comfort with it are different.",
    overview:
      "Risk tolerance includes how you feel about uncertainty. Risk capacity includes whether your finances and timeline can absorb a loss. A student who needs tuition next year may have little capacity for a large drop even if they enjoy a trading game.",
    example:
      "Sam says a 30% fall would not bother them, but their savings pay next term’s fees. Their comfort is high, while their ability to take that loss is low.",
    takeaway: "Consider both your feelings and your ability to absorb a loss.",
    questions: [
      q(
        "capacity",
        "multiple",
        "Who has less capacity for a sudden loss?",
        [
          "Someone who needs the money next month",
          "Someone practising with pretend money",
          "Both always have the same capacity",
        ],
        0,
        "An immediate need leaves less time and flexibility to recover.",
        "Risk capacity",
      ),
    ],
  },
  time: {
    title: "Match the timeline",
    eyebrow: "Investment Styles",
    description: "When you need your money changes the decision.",
    overview:
      "A short time horizon leaves less room to wait through a market decline. A longer horizon may allow more time for fluctuations, but never guarantees recovery. Access to money and a separate emergency buffer matter too.",
    example:
      "Lina compares a first car in 12 months with a distant retirement goal. She weighs near-term stability for the car and broader long-term investing options for retirement.",
    takeaway: "Begin with the date you need the money.",
    questions: [
      q(
        "horizon",
        "boolean",
        "A longer timeline guarantees you cannot lose money.",
        ["True", "False"],
        1,
        "More time can help manage fluctuations, but it does not remove investment risk.",
        "Time horizon",
      ),
    ],
  },
  diversification: {
    title: "Spread your exposure",
    eyebrow: "Investment Styles",
    description: "Avoid depending on one company, sector, or outcome.",
    overview:
      "Diversification means spreading investments across different sources of risk. Five companies in one industry can still move together. A mix across sectors and asset types may reduce concentration, while broad market risk remains.",
    example:
      "A portfolio holds five fictional electric-car stocks. A change affecting the entire industry pushes them all down together. Five names did not create five independent risks.",
    takeaway: "Count the risks, not just the number of holdings.",
    questions: [
      q(
        "diverse",
        "multiple",
        "Which better reduces concentration?",
        [
          "Five similar car companies",
          "A mix across sectors and asset types",
          "One company you like",
        ],
        1,
        "A broader mix reduces dependence on one sector. It still cannot prevent every loss.",
        "Diversification",
      ),
    ],
  },
  "long-term": {
    title: "Think beyond the next headline",
    eyebrow: "Investment Styles",
    description: "Plan, review, and learn from decisions.",
    overview:
      "Long-term thinking starts with goals, contributions, costs, and a plan for reviewing your mix. Repeated impulsive trades can add costs and behavioural mistakes. Review when your situation changes rather than reacting automatically to every post.",
    example:
      "After a fictional market fall, Jordan rereads their written goal and checks whether their timeline or needs changed. They compare options before acting instead of copying a panicked influencer.",
    takeaway: "A reasoned process is more useful than a lucky trade.",
    questions: [
      q(
        "long-plan",
        "multiple",
        "What is a thoughtful first response to a scary market headline?",
        [
          "Sell everything instantly",
          "Check the source, your goals, and your plan",
          "Borrow money to chase a rebound",
        ],
        1,
        "A pause creates space to check evidence and your circumstances. No single action fits everyone.",
        "Long-term thinking",
      ),
    ],
  },
};
export const videoChapters = [
  {
    title: "A small piece of a bigger idea",
    caption:
      "A share is a unit of ownership in a company. Imagine 100 equal pieces of one business.",
    label: "1 company · 100 shares",
    kind: "ownership",
  },
  {
    title: "Prices move. Ownership stays.",
    caption:
      "You buy 2 shares at 20 Stars each. If the price falls to 18, your 40-Star purchase is now worth 36 Stars.",
    label: "40 Stars → 36 Stars",
    kind: "risk",
  },
  {
    title: "Rights depend on the share",
    caption:
      "Some shares allow voting. A dividend is a possible company payment, never a guaranteed reward.",
    label: "Voting may apply · returns vary",
    kind: "rights",
  },
  {
    title: "Ask before you act",
    caption:
      "What do I own? What could I lose? When will I need this money? A good question is a strong first investment skill.",
    label: "Own · Risk · Timeline",
    kind: "questions",
  },
];
export const sourceLinks = [
  {
    title: "OSC Investor Office · Stocks",
    url: "https://www.getsmarteraboutmoney.ca/learning-path/stocks/how-stocks-and-dividends-work/",
  },
  {
    title: "CIRO · Warning signs of investment fraud",
    url: "https://www.ciro.ca/office-investor/avoiding-fraud-and-protecting-your-investments/warning-signs-investment-fraud",
  },
  {
    title: "Canadian Securities Administrators · Red flags of fraud",
    url: "https://www.securities-administrators.ca/investor-tools/avoiding-fraud/know-the-red-flags-of-fraud/",
  },
];

export function recordConceptAttempt(state, question, choice) {
  const correct = choice === question.answer,
    old = state.mastery?.[question.id] || {};
  return {
    ...state,
    hearts: correct ? state.hearts : Math.max(0, state.hearts - 1),
    mastery: {
      ...state.mastery,
      [question.id]: {
        concept: question.concept,
        question: question.text,
        explanation: question.explanation,
        attempts: (old.attempts || 0) + 1,
        correct: (old.correct || 0) + (correct ? 1 : 0),
        lastCorrect: correct,
      },
    },
    events: [
      ...(state.events || []),
      {
        type: "mastery",
        target: question.id,
        correct,
        at: new Date().toISOString(),
      },
    ],
  };
}
export function isPathwayFinished(state, path, completedNode) {
  const pathway = pathways.find((p) => p.id === path);
  return (
    !!pathway &&
    pathway.nodes.every(
      (node) =>
        node === completedNode ||
        state.lessonProgress?.[`${path}:${node}`]?.completed ||
        state.completed?.includes(path),
    )
  );
}
export function evaluateRedFlags(post, selection) {
  const hits = selection.filter((flag) => post.flags.includes(flag));
  const unsupported = selection.filter((flag) => !post.flags.includes(flag));
  return {
    hits,
    unsupported,
    canContinue: hits.length >= 2 && unsupported.length === 0,
  };
}
