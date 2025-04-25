import { describe, expect, test } from 'vitest'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react'
import { CartPage } from '../../refactoring/components/CartPage'
import { AdminPage } from '../../refactoring/components/AdminPage'
import { Coupon, MembershipTier, Product } from '../../types'
import StoreProvider from '../../refactoring/store/StoreProvider'
import useMembership from '../../refactoring/hooks/useMembership'
import { atom, createStore, Provider, useAtomValue } from 'jotai'
import { defaultTiers } from '../../refactoring/store/constants'
import { useDiscountCalculator } from '../../refactoring/hooks'
import { tiersAtom } from '../../refactoring/store/atom'

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
]
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
]

const TestAdminPage = () => {
  return (
    <StoreProvider
      initialProducts={mockProducts}
      initialCoupons={mockCoupons}
    >
      <AdminPage />
    </StoreProvider>
  )
}

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(
        <StoreProvider
          initialProducts={mockProducts}
          initialCoupons={mockCoupons}
        >
          <CartPage />
        </StoreProvider>
      )
      const product1 = screen.getByTestId('product-p1')
      const product2 = screen.getByTestId('product-p2')
      const product3 = screen.getByTestId('product-p3')
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가')

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1')
      expect(product1).toHaveTextContent('10,000원')
      expect(product1).toHaveTextContent('재고: 20개')
      expect(product2).toHaveTextContent('상품2')
      expect(product2).toHaveTextContent('20,000원')
      expect(product2).toHaveTextContent('재고: 20개')
      expect(product3).toHaveTextContent('상품3')
      expect(product3).toHaveTextContent('30,000원')
      expect(product3).toHaveTextContent('재고: 20개')

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument()

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(addToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3) // 상품3 추가

      const increaseButtons = screen.getAllByText('+')
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]) // 상품2
        fireEvent.click(increaseButtons[2]) // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument()

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox')
      fireEvent.change(couponSelect, { target: { value: '1' } }) // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument()

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }) // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument()
    })

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />)

      const $product1 = screen.getByTestId('product-1')

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'))

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      })
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      })
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      })

      fireEvent.click(screen.getByText('추가'))

      const $product4 = screen.getByTestId('product-4')

      expect($product4).toHaveTextContent('상품4')
      expect($product4).toHaveTextContent('15000원')
      expect($product4).toHaveTextContent('재고: 30')

      // 2. 상품 선택 및 수정
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('toggle-button'))
      fireEvent.click(within($product1).getByTestId('modify-button'))

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        })
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        })
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        })
      })

      fireEvent.click(within($product1).getByText('수정 완료'))

      expect($product1).toHaveTextContent('수정된 상품1')
      expect($product1).toHaveTextContent('12000원')
      expect($product1).toHaveTextContent('재고: 25')

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('modify-button'))

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        })
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        })
      })
      fireEvent.click(screen.getByText('할인 추가'))

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).not.toBeInTheDocument()

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      })
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      })
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      })
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      })

      fireEvent.click(screen.getByText('쿠폰 추가'))

      const $newCoupon = screen.getByTestId('coupon-3')

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인')
    })
  })

  describe('자유롭게 작성해보세요.', () => {
    test('새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      expect(true).toBe(true)
    })

    test('새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      expect(true).toBe(true)
    })
  })

  describe('useDiscountCalculator Hook 테스트', () => {
    const mockTier: MembershipTier = { id: '1', name: '실버', discountRate: 5 }
    const mockAmountCoupon: Coupon = {
      name: '500원 할인',
      code: 'AMOUNT500',
      discountType: 'amount',
      discountValue: 500,
    }
    const mockPercentCoupon: Coupon = {
      name: '10% 할인',
      code: 'PERCENT10',
      discountType: 'percentage',
      discountValue: 10,
    }

    test('쿠폰과 멤버십 할인이 모두 없을 때, 기본 할인 금액을 반환해야 합니다.', () => {
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: null,
          selectedTier: null,
        })
      )
      expect(result.current.totalAfterDiscount).toBe(10000)
    })

    test('금액 할인 쿠폰만 적용될 때, 정확한 할인 금액을 반영해야 합니다.', () => {
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: mockAmountCoupon,
          selectedTier: null,
        })
      )
      expect(result.current.totalAfterDiscount).toBe(9500)
    })

    test('금액 할인 쿠폰 적용 시 최종 금액이 0보다 작아지면 0을 반환해야 합니다.', () => {
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 300,
          selectedCoupon: mockAmountCoupon,
          selectedTier: null,
        })
      )
      expect(result.current.totalAfterDiscount).toBe(0)
    })

    test('비율 할인 쿠폰만 적용될 때, 정확한 할인율을 반영해야 합니다.', () => {
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: mockPercentCoupon,
          selectedTier: null,
        })
      )
      expect(result.current.totalAfterDiscount).toBe(9000)
    })

    test('멤버십 할인만 적용될 때, 정확한 할인율을 반영해야 합니다.', () => {
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: null,
          selectedTier: mockTier,
        })
      )
      expect(result.current.totalAfterDiscount).toBe(9500) // 10000 * (1 - 0.05)
    })

    test('금액 할인 쿠폰과 멤버십 할인이 모두 적용될 때, 순차적으로 정확하게 계산해야 합니다.', () => {
      // 쿠폰 먼저 적용 후 멤버십 할인 적용
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: mockAmountCoupon, // 500원 할인
          selectedTier: mockTier, // 5% 할인
        })
      )
      // (10000 - 500) * (1 - 0.05) = 9500 * 0.95 = 9025
      expect(result.current.totalAfterDiscount).toBe(9025)
    })

    test('비율 할인 쿠폰과 멤버십 할인이 모두 적용될 때, 순차적으로 정확하게 계산해야 합니다.', () => {
      // 쿠폰 먼저 적용 후 멤버십 할인 적용
      const { result } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: 10000,
          selectedCoupon: mockPercentCoupon, // 10% 할인
          selectedTier: mockTier, // 5% 할인
        })
      )
      // (10000 * (1 - 0.1)) * (1 - 0.05) = 9000 * 0.95 = 8550
      expect(result.current.totalAfterDiscount).toBe(8550)
    })
  })

  describe('useMembership Hook 테스트', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      const testStore = createStore()
      testStore.set(tiersAtom, defaultTiers)
      return <Provider store={testStore}>{children}</Provider>
    }

    test('초기 상태에서 사용 가능한 멤버십 등급 목록을 반환하고, 선택된 등급은 null이어야 합니다.', () => {
      const { result } = renderHook(() => useMembership(), { wrapper })
      expect(result.current.tiers).toEqual(defaultTiers)
      expect(result.current.selectedTier).toBeNull()
    })

    test('applyTierDiscount 함수를 호출하여 특정 멤버십 등급을 선택할 수 있어야 합니다.', () => {
      const { result } = renderHook(() => useMembership(), { wrapper })
      const silverTier = defaultTiers[1]

      act(() => {
        result.current.applyTierDiscount(silverTier)
      })

      expect(result.current.selectedTier).toEqual(silverTier)
    })

    test('다른 멤버십 등급을 선택하면 상태가 업데이트되어야 합니다.', () => {
      const { result } = renderHook(() => useMembership(), { wrapper })
      const silverTier = defaultTiers[1]
      const normalTier = defaultTiers[0]

      act(() => {
        result.current.applyTierDiscount(silverTier)
      })
      expect(result.current.selectedTier).toEqual(silverTier)

      act(() => {
        result.current.applyTierDiscount(normalTier)
      })
      expect(result.current.selectedTier).toEqual(normalTier)
    })
  })

  describe('통합 테스트: 멤버십 선택 후 할인 계산', () => {
    const initialTiers: MembershipTier[] = [
      { id: '1', name: '브론즈', discountRate: 2 },
      { id: '2', name: '실버', discountRate: 5 },
    ]
    const mockAmountCoupon: Coupon = {
      name: '1000원 할인',
      code: 'AMOUNT1000',
      discountType: 'amount',
      discountValue: 1000,
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      const testStore = createStore()
      testStore.set(tiersAtom, initialTiers)
      return <Provider store={testStore}>{children}</Provider>
    }

    test('멤버십 등급을 선택하고 쿠폰을 적용했을 때, useDiscountCalculator가 올바른 최종 가격을 계산해야 합니다.', () => {
      const { result: membershipResult } = renderHook(() => useMembership(), {
        wrapper,
      })
      const silverTier = initialTiers[1]
      act(() => {
        membershipResult.current.applyTierDiscount(silverTier)
      })

      const basePriceAfterProductDiscount = 15000
      const { result: discountResult } = renderHook(() =>
        useDiscountCalculator({
          defaultAfterDiscount: basePriceAfterProductDiscount,
          selectedCoupon: mockAmountCoupon,
          selectedTier: membershipResult.current.selectedTier,
        })
      )

      expect(discountResult.current.totalAfterDiscount).toBe(13300)
    })
  })
})
