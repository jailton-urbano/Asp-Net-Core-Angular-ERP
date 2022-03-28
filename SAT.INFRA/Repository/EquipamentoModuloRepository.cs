﻿using Microsoft.EntityFrameworkCore;
using SAT.INFRA.Context;
using SAT.INFRA.Interfaces;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Constants;
using SAT.MODELS.Entities.Params;
using SAT.MODELS.Helpers;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace SAT.INFRA.Repository
{
    public class EquipamentoModuloRepository : IEquipamentoModuloRepository
    {
        private readonly AppDbContext _context;

        public EquipamentoModuloRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool ExisteEquipamentoModulo(EquipamentoModulo equipamentoModulo)
        {
            return _context.EquipamentoModulo.FirstOrDefault(a => a.CodECausa == equipamentoModulo.CodECausa && a.CodEquip == equipamentoModulo.CodEquip) != null;
        }

        public void Atualizar(EquipamentoModulo equipamentoModulo)
        {
            _context.ChangeTracker.Clear();
            EquipamentoModulo linhaTabela = _context.EquipamentoModulo.FirstOrDefault(a => a.CodECausa == equipamentoModulo.CodECausa && a.CodEquip == equipamentoModulo.CodEquip);

            if (linhaTabela != null)
            {
                equipamentoModulo.CodConfigEquipModulos = linhaTabela.CodConfigEquipModulos;
                try
                {
                    _context.Entry(linhaTabela).CurrentValues.SetValues(equipamentoModulo);
                    _context.Entry(linhaTabela).State = EntityState.Modified;
                    _context.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    throw new Exception(Constants.NAO_FOI_POSSIVEL_ATUALIZAR);
                }
            }
        }

        public void Criar(EquipamentoModulo equipamentoModulo)
        {
            try
            {
                _context.Add(equipamentoModulo);
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                throw new Exception(Constants.NAO_FOI_POSSIVEL_CRIAR);
            }
        }

        public void Deletar(int codigo)
        {
            EquipamentoModulo a = _context.EquipamentoModulo.SingleOrDefault();

            if (a != null)
            {
                try
                {
                    _context.EquipamentoModulo.Remove(a);
                    _context.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    throw new Exception(Constants.NAO_FOI_POSSIVEL_DELETAR);
                }
            }
        }

        public EquipamentoModulo ObterPorCodigo(int codigo)
        {
            return _context.EquipamentoModulo
                .Include(i => i.Equipamento)
                    .ThenInclude(i => i.TipoEquipamento)
                .Include(i => i.Causa).Where(ca => ca.Causa.IndAtivo == 1)
                .SingleOrDefault(s => s.CodEquip == codigo);
        }

        public PagedList<EquipamentoModulo> ObterPorParametros(EquipamentoModuloParameters parameters)
        {
            var equipamentoModulo = _context.EquipamentoModulo
                .Include(i => i.Equipamento)
                    .ThenInclude(i => i.TipoEquipamento)
                .Include(i => i.Causa).Where(ca => ca.Causa.IndAtivo == 1)
                .AsQueryable();

            if (parameters.Filter != null)
            {
                equipamentoModulo = equipamentoModulo.Where(
                    c =>
                    c.Equipamento.NomeEquip.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    c.Causa.CodECausa.Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty) ||
                    c.Equipamento.DescEquip.ToString().Contains(!string.IsNullOrWhiteSpace(parameters.Filter) ? parameters.Filter : string.Empty)
                );
            }

            if (!string.IsNullOrWhiteSpace(parameters.CodECausa))
            {
                equipamentoModulo = equipamentoModulo.Where(w => w.CodECausa == parameters.CodECausa);
            }

            if (parameters.CodEquip.HasValue)
            {
                equipamentoModulo = equipamentoModulo.Where(w => w.CodEquip == parameters.CodEquip);
            }

            return PagedList<EquipamentoModulo>.ToPagedList(equipamentoModulo, parameters.PageNumber, parameters.PageSize);
        }
    }
}