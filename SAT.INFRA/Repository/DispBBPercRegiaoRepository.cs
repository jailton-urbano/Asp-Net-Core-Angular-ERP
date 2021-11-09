using System.Collections.Generic;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;

namespace SAT.INFRA.Repository
{
    public class DispBBPercRegiaoRepository : IDispBBPercRegiaoRepository
    {
        private readonly AppDbContext _context;

        public DispBBPercRegiaoRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<DispBBPercRegiao> ObterPorParametros(DispBBPercRegiaoParameters parameters)
        {
            return null;
        }
    }
}