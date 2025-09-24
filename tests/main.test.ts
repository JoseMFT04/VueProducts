describe('Main.ts', () => {
  test('should retur proper env values', () => {
    expect(import.meta.env.VITE_TESLO_API_URL).toBe('http://localhost:3000/api');
  });
});
