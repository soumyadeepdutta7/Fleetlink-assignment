import { calculateRideDuration } from '@/lib/utils'

describe('calculateRideDuration', () => {
  it('should calculate ride duration correctly', () => {
    expect(calculateRideDuration('110001', '110002')).toBe(1)
    expect(calculateRideDuration('110001', '110005')).toBe(4)
    expect(calculateRideDuration('110005', '110001')).toBe(4) // Absolute difference
    expect(calculateRideDuration('110001', '110025')).toBe(0) // 24 % 24 = 0
    expect(calculateRideDuration('110001', '110026')).toBe(1) // 25 % 24 = 1
  })

  it('should handle invalid pincodes gracefully', () => {
    expect(calculateRideDuration('invalid', '110001')).toBe(1) // parseInt('invalid') = NaN, treated as 0
    expect(calculateRideDuration('110001', 'invalid')).toBe(1)
    expect(calculateRideDuration('invalid', 'invalid')).toBe(0)
  })
})