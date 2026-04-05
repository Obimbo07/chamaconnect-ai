import type { User, Chama } from '@/lib/mockData';

export interface AIResponse {
  text: string;
  language: 'en' | 'sw';
}

// Generate contextual AI responses based on user state
export function generateAIResponse(
  message: string,
  user: User,
  chama: Chama
): AIResponse {
  const userLowercase = message.toLowerCase();
  const swahiliPatterns = /habari|mali|shares|kusave|mgogoro|mikopo/i;
  const language = swahiliPatterns.test(message) ? 'sw' : 'en';

  // Context-aware responses
  if (userLowercase.includes('share') || userLowercase.includes('aksh')) {
    return shareRecommendation(user, chama, language);
  }

  if (userLowercase.includes('loan') || userLowercase.includes('mikopo')) {
    return loanGuidance(user, chama, language);
  }

  if (userLowercase.includes('fine') || userLowercase.includes('penalty') || userLowercase.includes('mgogoro')) {
    return fineAdvice(user, chama, language);
  }

  if (userLowercase.includes('save') || userLowercase.includes('kusave') || userLowercase.includes('contributio')) {
    return savingsAdvice(user, chama, language);
  }

  if (userLowercase.includes('dividend') || userLowercase.includes('profit')) {
    return dividendProjection(user, chama, language);
  }

  if (userLowercase.includes('help') || userLowercase.includes('msaada')) {
    return getHelp(user, chama, language);
  }

  // Default responses
  return defaultResponse(user, chama, language, message);
}

function shareRecommendation(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  const member = chama.shareCapital.members.find((m) => m.memberId === user.id);
  const sharesHeld = member?.sharesHeld || 0;
  const fines = chama.fines.filter((f) => f.memberId === user.id).length;

  if (language === 'sw') {
    if (sharesHeld === 0) {
      return {
        text: `Habari ${user.name}! Sasa ni wakati mzuri kuanzia kutengeneza akshi. Kwa akshi ya ${chama.shareCapital.nominalValuePerShare} KSh kila moja, unaweza kuanzia na akshi 5 za KSh ${chama.shareCapital.nominalValuePerShare * 5}. Hii itakupatia uhusiano katika kampuni.`,
        language: 'sw',
      };
    }
    if (fines > 0) {
      return {
        text: `${user.name}, nakumbuka kuwa una ${fines} mgogoro. Kupata akshi zaidi inakuwa na faida - akshi moja zaidi inakumaanisha dhamana kubwa na kulingana na muundo wa kupokea pesa (dividend).`,
        language: 'sw',
      };
    }
    return {
      text: `Vizuri sana! Una ${sharesHeld} akshi. Kuweza kubiri akshi zaidi ni akili nzuri kwa ajili ya ukuaji wa mali.`,
      language: 'sw',
    };
  }

  if (sharesHeld === 0) {
    return {
      text: `Great to meet you, ${user.name}! Now is the perfect time to start building your share portfolio. With each share valued at KSh ${chama.shareCapital.nominalValuePerShare}, I recommend starting with 5 shares (KSh ${chama.shareCapital.nominalValuePerShare * 5}). This gives you ownership and voting rights in the chama.`,
      language: 'en',
    };
  }

  if (fines > 0) {
    return {
      text: `${user.name}, I noticed you have ${fines} pending fine(s). Buying more shares actually helps - increased ownership means higher dividend payouts that can offset penalties. Win-win strategy!`,
      language: 'en',
    };
  }

  return {
    text: `Excellent progress, ${user.name}! You hold ${sharesHeld} shares. Consider increasing your portfolio by 2-3 shares monthly for compound growth.`,
    language: 'en',
  };
}

function loanGuidance(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  const loans = chama.transactions.filter((t) => t.type === 'loan' && t.memberId === user.id);
  const repayments = chama.transactions.filter((t) => t.type === 'repayment' && t.memberId === user.id);
  const loanAmount = loans.reduce((sum, t) => sum + t.amount, 0);
  const repaidAmount = repayments.reduce((sum, t) => sum + t.amount, 0);
  const outstanding = loanAmount - repaidAmount;

  if (language === 'sw') {
    if (outstanding > 0) {
      return {
        text: `${user.name}, una mikopo ya KSh ${outstanding} ambayo bado haijapelekwa. Asante kwa kulipa KSh ${repaidAmount} hadi sasa. Kuendelea na kulipa kwa wakati ni sehemu ya muundo wa chama.`,
        language: 'sw',
      };
    }
    return {
      text: `Hongera! Umebayar mikopo yote yako. Sasa unaweza kuomba mikopo mengine ikiwa unajihitaji, lakini kumbuka kusambaza mahitaji yako kwa kupata pesa zaidi.`,
      language: 'sw',
    };
  }

  if (outstanding > 0) {
    const repaymentRatio = (repaidAmount / loanAmount) * 100;
    return {
      text: `${user.name}, you're doing well! You've repaid KSh ${repaidAmount} of your KSh ${loanAmount} loan (${repaymentRatio.toFixed(0)}% complete). Keep up the monthly payments to maintain good standing in the chama.`,
      language: 'en',
    };
  }

  return {
    text: `Congratulations ${user.name}! You've cleared all outstanding loans. You're now eligible to apply for new loans up to your share value limit. Strong financial discipline!`,
    language: 'en',
  };
}

function fineAdvice(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  const memberFines = chama.fines.filter((f) => f.memberId === user.id);
  const totalFines = memberFines.reduce((sum, f) => sum + f.amount, 0);

  if (language === 'sw') {
    if (memberFines.length > 0) {
      return {
        text: `${user.name}, una mgogoro wa jumla ya KSh ${totalFines}. Tahadhari - kulipwa kwa wakati kupunguza mgogoro. Kwa kujenga akshi zaidi, unaweza kulinganisha risala kulingana na mali.`,
        language: 'sw',
      };
    }
    return {
      text: `Pole sana! Huna mgogoro. Kuendelea kuweka muundo huu - kulipwa kwa wakati ni kazi nzuri sana!`,
      language: 'sw',
    };
  }

  if (memberFines.length > 0) {
    return {
      text: `${user.name}, I see you have KSh ${totalFines} in fines. Here's my recommendation: (1) Clear these immediately, (2) Review payment dates to avoid future penalties, (3) Set calendar reminders for contribution deadlines.`,
      language: 'en',
    };
  }

  return {
    text: `Great news, ${user.name}! You have no fines. This perfect record shows you're a trusted member. Keep up the timely payments!`,
    language: 'en',
  };
}

function savingsAdvice(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  const memberSavings = chama.transactions
    .filter((t) => t.type === 'contribution' && t.memberId === user.id)
    .reduce((sum, t) => sum + t.amount, 0);

  if (language === 'sw') {
    if (memberSavings > 0) {
      return {
        text: `${user.name}, umekusanya KSh ${memberSavings} hadi sasa. Sana sana vizuri! Endelea kupiga akili kwa sehemu ya ${Math.round((memberSavings / 10000) * 100)}% ndio taka yako.`,
        language: 'sw',
      };
    }
    return {
      text: `Mimi nakamatia kuwa hujasambaza chochote. Hii ni mwanzo mzuri! Anza na akshi moja au zaidi kila mwezi.`,
      language: 'sw',
    };
  }

  if (memberSavings > 0) {
    return {
      text: `Excellent, ${user.name}! You've saved KSh ${memberSavings} so far. At this rate, you'll reach your financial goals faster. Consider automating monthly contributions to stay on track.`,
      language: 'en',
    };
  }

  return {
    text: `${user.name}, I'd love to help you start your savings journey! Begin with even KSh 1,000-2,000 monthly. Small, consistent contributions compound into wealth.`,
    language: 'en',
  };
}

function dividendProjection(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  const member = chama.shareCapital.members.find((m) => m.memberId === user.id);
  const ownership = member ? member.ownershipPercent : 0;
  const estimatedDividend = chama.shareCapital.totalValue * 0.1 * (ownership / 100);

  if (language === 'sw') {
    if (ownership > 0) {
      return {
        text: `${user.name}, kwa msingi wa akshi yako (${ownership.toFixed(1)}%), unaweza kutaraji dividend ya takriban KSh ${Math.round(estimatedDividend)} katika sehemu ya kuja (ukikamata faida ya 10%).`,
        language: 'sw',
      };
    }
    return {
      text: `Ungependa kuona dividend? Kuanzia kwa akshi na utaanza kupokea faida!`,
      language: 'sw',
    };
  }

  if (ownership > 0) {
    return {
      text: `${user.name}, with your ${ownership.toFixed(1)}% ownership, you're positioned to earn approximately KSh ${Math.round(estimatedDividend)} in dividend payouts (assuming 10% annual profit margin). The more you invest, the more you earn!`,
      language: 'en',
    };
  }

  return {
    text: `${user.name}, start building your share portfolio and you'll start earning dividends! Even 1-2 shares unlock profit-sharing benefits.`,
    language: 'en',
  };
}

function getHelp(user: User, chama: Chama, language: 'en' | 'sw'): AIResponse {
  if (language === 'sw') {
    return {
      text: `Karibuni ${user.name}! Ninaweza kukusaidia kupitia:
1. 📊 Kuhusu akshi na mali
2. 💰 Muundo wa kusambaza pesa
3. 🏦 Mikopo na malipo
4. 📈 Makadirio ya faida
5. ⚖️ Mgogoro na adhabu

Unaweza pia kubofya kwenye kila sehemu ya dashboard kwa maelezo zaidi.`,
      language: 'sw',
    };
  }

  return {
    text: `Hello ${user.name}! I can help you with:
1. 📊 Share capital and ownership
2. 💰 Savings strategies
3. 🏦 Loans and repayments
4. 📈 Dividend projections
5. ⚖️ Fines and penalties

Just ask me anything about your finances!`,
    language: 'en',
  };
}

function defaultResponse(
  user: User,
  chama: Chama,
  language: 'en' | 'sw',
  message: string
): AIResponse {
  if (language === 'sw') {
    return {
      text: `${user.name}, siyezi kuandika rafiki wa akshi yako kutokana na "${message}". Jaribu kuuliza kuhusu akshi, mikopo, kusambaza pesa, au mgogoro.`,
      language: 'sw',
    };
  }

  return {
    text: `${user.name}, I'm not quite sure about "${message}". Try asking me about shares, loans, savings, dividends, or fines. I'm here to help optimize your chama finances!`,
    language: 'en',
  };
}
