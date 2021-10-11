import { Navigation } from '../../components/menu/navigation'
import { isFeatureEnabled } from '../../helpers/markets/markets-data'
import messages from './messages'

export const moreMenuItems: Navigation[] = [
    {
        link: '/faucet',
        title: messages.faucet,
        isVisible: isFeatureEnabled.faucet
    },
    {
        link: 'https://docs.aave.com/faq/',
        title: messages.faq,
        absolute: true
    }
]

export const moreMenuExtraItems: Navigation[] = []

export const moreMenuMobileOnlyItems: Navigation[] = []
