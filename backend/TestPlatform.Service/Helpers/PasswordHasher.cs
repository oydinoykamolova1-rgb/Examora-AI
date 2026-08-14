using System.Security.Cryptography;
using System.Text;

namespace TestPlatform.Service.Helpers;

public static class PasswordHasher
{
    /// <summary>
    /// Hashes a password using a random 16-byte salt and HMACSHA256.
    /// Format: "SALT_BASE64:HASH_BASE64"
    /// </summary>
    public static string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        using var hmac = new HMACSHA256(salt);
        byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    /// <summary>
    /// Verifies input password against stored hash. Supports both new salted format and legacy unsalted SHA256.
    /// </summary>
    public static bool VerifyPassword(string password, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash))
            return false;

        // Check if storedHash contains salt separator ':'
        if (storedHash.Contains(':'))
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2) return false;

            byte[] salt = Convert.FromBase64String(parts[0]);
            byte[] expectedHash = Convert.FromBase64String(parts[1]);

            using var hmac = new HMACSHA256(salt);
            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return CryptographicOperations.FixedTimeEquals(computedHash, expectedHash);
        }

        // Legacy SHA256 fallback (for seeded initial database users)
        using var sha256 = SHA256.Create();
        byte[] bytes = Encoding.UTF8.GetBytes(password);
        byte[] legacyHash = sha256.ComputeHash(bytes);
        string legacyBase64 = Convert.ToBase64String(legacyHash);

        return legacyBase64 == storedHash;
    }
}
