using System.Linq.Expressions;
using TestPlatform.Domain.Common;

namespace TestPlatform.Data.Repositories;

public interface IRepository<T> where T : Auditable
{
    IQueryable<T> GetAll();
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
}
