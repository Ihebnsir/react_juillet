import { isSafeExternalUrl } from './centreDocumentStatus';

test('accepts only bounded HTTP and HTTPS external URLs', () => {
  expect(isSafeExternalUrl('https://example.test/document')).toBe(true);
  expect(isSafeExternalUrl('http://example.test/document')).toBe(true);
  expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
  expect(isSafeExternalUrl('data:text/plain,test')).toBe(false);
  expect(isSafeExternalUrl('file:///tmp/document')).toBe(false);
  expect(isSafeExternalUrl(`https://example.test/${'a'.repeat(500)}`)).toBe(false);
});
