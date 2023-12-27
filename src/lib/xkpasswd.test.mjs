import {XKPasswd} from './xkpasswd.mjs';

describe('Test XKPasswd password', () => {
  const me = new XKPasswd();

  test('Check if the password function returns a string', () => {
    expect(typeof me.password()).toEqual(expect.any(String));
  });

  test('Check if the password function returns a random password', () => {
    /*
     * We check this by getting a password 10 times and check if they are
     * different or the same.
     * Success is when they are all different.
     */
    const pwds = [];

    for (let index = 0; index < 10; index++) {
      pwds.push(me.password());
    }

    const findDuplicates = (ar) =>
      ar.filter((item, index) => ar.indexOf(item) !== index);

    const duplicates = findDuplicates(pwds);
    // console.log('DEBUG ' + pwds);
    expect(duplicates.length).toBe(0);
  });
});
