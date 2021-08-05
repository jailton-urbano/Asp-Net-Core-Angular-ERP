﻿using Microsoft.EntityFrameworkCore;
using SAT.API.Context;
using SAT.API.Repositories.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Helpers;
using System.Linq.Dynamic.Core;
using System.Linq;
using SAT.MODELS.Entities.Constants;
using System;

namespace SAT.API.Repositories
{
    public class AcordoNivelServicoRepository : IAcordoNivelServicoRepository
    {
        private readonly AppDbContext _context;

        public AcordoNivelServicoRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Atualizar(AcordoNivelServico acordoNivelServico)
        {
            AcordoNivelServico ans = _context.AcordoNivelServico.SingleOrDefault(a => a.CodSLA == acordoNivelServico.CodSLA);

            if (ans != null)
            {
                _context.Entry(ans).CurrentValues.SetValues(acordoNivelServico);

                try
                {
                    _context.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    throw new Exception(Constants.NAO_FOI_POSSIVEL_ATUALIZAR);
                }
            }
        }

        public void Criar(AcordoNivelServico acordoNivelServico)
        {
            try
            {
                _context.Add(acordoNivelServico);
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw new Exception(Constants.NAO_FOI_POSSIVEL_CRIAR);
            }
        }

        public void Deletar(int codigo)
        {
            AcordoNivelServico ans = _context.AcordoNivelServico.SingleOrDefault(a => a.CodSLA == codigo);

            if (ans != null)
            {
                _context.AcordoNivelServico.Remove(ans);

                try
                {
                    _context.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    throw new Exception(Constants.NAO_FOI_POSSIVEL_DELETAR);
                }
            }
        }

        public AcordoNivelServico ObterPorCodigo(int codigo)
        {
            return _context.AcordoNivelServico.SingleOrDefault(a => a.CodSLA == codigo);
        }

        public PagedList<AcordoNivelServico> ObterPorParametros(AcordoNivelServicoParameters parameters)
        {
            var slas = _context.AcordoNivelServico.AsQueryable();

            if (parameters.Filter != null)
            {
                slas = slas.Where(
                            s =>
                            s.NomeSLA.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                            s.CodSLA.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (parameters.CodSLA != null)
            {
                slas = slas.Where(s => s.CodSLA == parameters.CodSLA);
            }

            if (parameters.SortActive != null && parameters.SortDirection != null)
            {
                slas = slas.OrderBy(parameters.SortActive, parameters.SortDirection);
            }

            return PagedList<AcordoNivelServico>.ToPagedList(slas, parameters.PageNumber, parameters.PageSize);
        }
    }
}