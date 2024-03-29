﻿using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using NLog;
using SAT.MODELS.Entities;
using SAT.MODELS.Entities.Constants;
using SAT.SERVICES.Interfaces;
using SAT.SERVICES.Services;
using System;
using System.Net;
using System.Threading.Tasks;

namespace SAT.API.Support
{
    public class CustomExceptionMiddleware
    {
        private static readonly Logger _logger = NLog.LogManager.GetCurrentClassLogger();
        private readonly RequestDelegate _next;
        private static IEmailService _emailService;

        public CustomExceptionMiddleware(
            RequestDelegate next,
            IEmailService emailService
        )
        {
            _next = next;
            _emailService = emailService;
        }
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex).ConfigureAwait(false);
            }
        }
        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";
            int statusCode = (int)HttpStatusCode.InternalServerError;
            var result = JsonConvert.SerializeObject(new { statusCode = statusCode, errorMessage = Constants.ERROR });
            _logger.Error($"{statusCode} {ex.Message} {ex.InnerException}");
            string[] destinatarios = { Constants.EQUIPE_SAT_EMAIL };
            _emailService.Enviar(new Email() {
                Assunto = "Erro durante o uso do SAT.V2",
                Corpo = $"{statusCode} {ex.Message} {ex.InnerException}",
                EmailDestinatarios = destinatarios,
            });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;
            return context.Response.WriteAsync(result);
        }
    }
}
