import AccountApi from '../../src/wallet/account/accountapi'
import { printToConsole } from '../testhelpers'

const underTest = new AccountApi('http://localhost:16889/rpc')

// remove the x from 'xit' to test `create new key` function
// use this new key only on the privatenet
// new key is only created when there a no other keys
xit('new key', async () => {
  let count = await underTest.ListKeys()

  if (count.addresses.length < 1) {
    let actual = await underTest.NewKey('qwertyuiop')

    printToConsole('new key', actual)

    let { result: {
      address }
    } = actual

    expect(address).toBeDefined()
  }
})

it('list key', async () => {
  let actual = await underTest.ListKeys()

  printToConsole('list key', actual)

  let { addresses } = actual

  expect(addresses).toBeDefined()
})

it('unlock key', async () => {
  let actual = await underTest.UnlockKey('0x2E833968E5bB786Ae419c4d13189fB081Cc43bab', 'qwertyuiop')

  printToConsole('unlock key', actual)

  let { unlocked } = actual

  expect(unlocked).toBe(true)
})

it('lock key', async () => {
  let actual = await underTest.LockKey('0x2E833968E5bB786Ae419c4d13189fB081Cc43bab')

  printToConsole('lock key', actual)

  let { unlocked } = actual

  expect(unlocked).toBe(false)
})

it('is key unlocked', async () => {
  let actual = await underTest.IsKeyUnlocked('0x2E833968E5bB786Ae419c4d13189fB081Cc43bab')

  printToConsole('is key unlocked', actual)

  let { unlocked } = actual

  expect(unlocked).toBe(false)
})
