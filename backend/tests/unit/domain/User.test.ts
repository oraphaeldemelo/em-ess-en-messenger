import { User } from '@/domain/entities/User';

describe('User', () => {
    it('should be valid when username, email and password are provided', () => {
        const user = new User(
            '1',
            'raphael',
            'raphael@example.com',
            '123456'
        );

        const result = user.isValid();

        expect(result).toBe(true);
    });

    it('should be invalid when username is empty', () => {
        const user = new User(
            '1',
            '',
            'raphael@example.com',
            '123456',
        )

        const result = user.isValid();

        expect(result).toBe(false);
    })
});