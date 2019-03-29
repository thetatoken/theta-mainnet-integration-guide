import { registerDecorator } from 'class-validator'
import WAValidator from 'wallet-address-validator'

export function IsWalletAddress (property, validationOptions) {
  return function (object, propertyName) {
    registerDecorator({
      name: 'isWalletAddress',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate (value, args) {
          return typeof value === 'string' && WAValidator.validate(value, 'ETH')
        }
      }
    })
  }
}
