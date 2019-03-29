export function printToConsole (test, actual) {
  console.log(`-- ${test} -- \n`, JSON.stringify(actual, null, 1))
}
