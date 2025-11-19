using MemoryGameKidsBack.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MemoryGameKidsBack.Repository
{
    public class GenericRepository<T> : IRepository<T> where T : class
    {

        private readonly KidsMemoreyTestDBContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepository(KidsMemoreyTestDBContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public void Add(T entity)
        {
            _dbSet.Add(entity);
        }

        public int Counter()
        {
            try
            {
                return _dbSet.AsNoTracking().Count();
            }
            catch (SqlException)
            {
                return -1;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public void Delete(int id)
        {
            var entity = _dbSet.Find(id);
            if (entity != null) _dbSet.Remove(entity);
        }

        public IEnumerable<T> GetAll()
        {
            try
            {
                return _dbSet.AsNoTracking().ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<T> GetAllIncluding(params string[] includes)
        {
            IQueryable<T> query = _dbSet.AsQueryable();

            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return query.AsNoTracking().ToList();
        }

        public T GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public IEnumerable<T> GetWithPagination(int page = 1, int pageSize = 10)
        {
            IEnumerable<T> list = _dbSet.AsNoTracking().ToList();
            //Pagination
            var totalCount = _dbSet.Count();
            var totalPage = (int)Math.Ceiling((double)totalCount / pageSize);
            list = list.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return list;
        }

        public IEnumerable<T> Search(Expression<Func<T, bool>> predicate)
        {
            return _dbSet.Where(predicate).AsNoTracking().ToList();
        }

    }
}
