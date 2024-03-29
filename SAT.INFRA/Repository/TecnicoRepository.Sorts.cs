using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace SAT.INFRA.Repository
{
    public partial class TecnicoRepository : ITecnicoRepository
    {
        public IQueryable<Tecnico> AplicarOrdenacao(IQueryable<Tecnico> query, string sortActive, string sortDirection)
        {
            if (!string.IsNullOrEmpty(sortActive) && !string.IsNullOrEmpty(sortDirection))
            {
                switch (sortActive)
                {                  
                    
                    //case "datahoraAberturaOS":
                    //    query = sortDirection == "asc" ?
                    //        query.Where(s => s.DataHoraAberturaOS != null).OrderBy(q => q.DataHoraAberturaOS) :
                    //        query.Where(s => s.DataHoraAberturaOS != null).OrderByDescending(q => q.DataHoraAberturaOS);
                    //    break;

                    default:
                        query = query.OrderBy(string.Format("{0} {1}", sortActive, sortDirection));
                        break;
                }
            }

            return query;
        }
    }
}
