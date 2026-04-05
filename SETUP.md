# ChamaAI Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 3. Access the Application
- **Entry Point**: `http://localhost:3000` (auto-redirects to login)
- **Login Page**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard` (after login)
- **Accessibility**: `http://localhost:3000/dashboard/accessibility`

## Demo Login

Click any of the **Quick Access** buttons on the login page:

1. **Austin Obimbo (Chairperson)** - Obimbo Chama Growth Stage
2. **Jane Wanjiku (Treasurer)** - Obimbo Chama Finance View
3. **John Doe (Member)** - Obimbo Chama Member View
4. **Peter Ochieng (Chairperson)** - Umoja SACCO Mature Stage
5. **Mary Akinyi (Member)** - Umoja SACCO Member View

Or manually enter any of these credentials:
```
Email: obimboausts@gmail.com
Password: s0ftware123##
```

## Project Files Overview

### Core Application
- `/app/layout.tsx` - Root layout with ChamaProvider
- `/app/page.tsx` - Entry point (redirects to login/dashboard)
- `/app/login/page.tsx` - Authentication interface
- `/app/dashboard/page.tsx` - Main dashboard with tabs
- `/app/dashboard/accessibility/page.tsx` - USSD & WhatsApp features
- `/app/api/chat/route.ts` - AI chat API endpoint

### Components
- `DeFiVisualizer.tsx` - Charts, metrics, transaction analysis
- `AdminShareIssuer.tsx` - Share issuance controls (admin only)
- `BlockchainLedger.tsx` - Immutable transaction ledger
- `AICompanionChat.tsx` - Bilingual (EN/SW) chatbot
- `USSDSimulator.tsx` - Feature-phone interface demo
- `WhatsAppBotDemo.tsx` - WhatsApp bot interface demo

### Data & Logic
- `/lib/mockData.ts` - Complete dataset (2 chamas, 5 users, transactions)
- `/lib/mockAIResponses.ts` - AI response generation logic
- `/utils/smartContractSimulator.ts` - Share issuance & calculations
- `/contexts/ChamaContext.tsx` - Global state management

## Features to Explore

### 1. Dashboard Overview
Login as **Austin Obimbo** (chairperson) and explore:
- Share capital metrics
- Transaction timeline
- Member ownership distribution
- Savings and loan summary

### 2. Share Issuance (Admin Feature)
As Austin or Jane (treasury), go to **Share Manager** tab:
- Select a member (John or Jane for Obimbo)
- Issue 5-10 shares
- Watch utilization jump from 0% → X%
- See blockchain ledger update automatically

### 3. AI Assistant
In **AI Assistant** tab, try asking:
- "Tell me about shares"
- "Check my loans"
- "How do I save more?"
- "What are my dividends?"
- Change language to Swahili and repeat

### 4. Blockchain Ledger
Click **Blockchain** tab to see:
- All transactions with cryptographic hashes
- Immutable transaction history
- Transaction types (Contribution, Loan, Repayment, etc.)
- Security verification badges

### 5. Switch Chamas
Use the **Chama Selector** (top of page) to:
- Switch to **Umoja SACCO** (mature, 85% utilized)
- Compare with **Obimbo Chama** (growth, 0% utilized)
- Understand different operational stages

### 6. Accessibility Features
Click **Accessibility** button to see:
- **USSD Simulator**: Dial *384*6001# flow
- **WhatsApp Bot**: Chat interface (save +254 711 000 001)
- Impact metrics for financial inclusion

## Development Tips

### Adding New Features
1. Create component in `/components/`
2. Use ChamaContext for global state: `const { currentUser, currentChama } = useChamaContext()`
3. Import and use in dashboard tabs

### Modifying Mock Data
Edit `/lib/mockData.ts`:
- Add users to `mockUsers` array
- Add transactions to `chama.transactions`
- Update blockchain ledger entries

### Extending AI Responses
Edit `/lib/mockAIResponses.ts`:
- Add new pattern matching in `generateAIResponse()`
- Create new response functions
- Add Swahili translations

### Smart Contract Logic
Edit `/utils/smartContractSimulator.ts`:
- Modify share issuance logic
- Change dividend calculations
- Add new member operations

## Building for Production

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start
```

## Environment Setup (Future)

When integrating real services, add to `.env.local`:

```env
# AI Integration
HUGGING_FACE_API_KEY=your_key_here
HUGGING_FACE_API_URL=https://api-inference.huggingface.co/models/

# Database (when ready)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication (when ready)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## Common Issues & Solutions

### Issue: Login doesn't work
**Solution**: Ensure you're using exact credentials from demo list. Check browser console for errors.

### Issue: Charts not showing
**Solution**: Check that Recharts is installed. Run `pnpm install recharts` if needed.

### Issue: AI Chat returns errors
**Solution**: The mock API is running locally. No real API key needed for demo.

### Issue: Styles look off
**Solution**: Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) and restart dev server.

## Next Steps

### To Add Real Features:
1. **Replace Mock Data**: Connect to Supabase/Neon PostgreSQL
2. **Add Real Auth**: Implement Auth.js with credentials/OAuth
3. **Integrate Real AI**: Add Hugging Face API key
4. **Blockchain Integration**: Add Polygon/Ethereum contract calls
5. **Mobile Money**: Integrate M-Pesa/payment gateways
6. **Real USSD**: Connect to Africastalking or Vonage

### Testing Checklist:
- [ ] Login with all 5 demo users
- [ ] Switch between chamas
- [ ] Issue shares as chairperson
- [ ] Chat with AI in both languages
- [ ] View blockchain ledger
- [ ] Test USSD/WhatsApp simulators
- [ ] Test on mobile (use `pnpm dev` and open on phone)

## Support

For questions or issues:
1. Check the `/README.md` for detailed documentation
2. Review code comments in component files
3. Examine `/lib/mockData.ts` for data structure examples

---

**Happy building! Let's revolutionize African financial inclusion.**
