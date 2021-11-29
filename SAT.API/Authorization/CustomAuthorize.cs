using System.Linq;
using Microsoft.AspNetCore.Authorization;
using SAT.MODELS.Enums;

namespace SAT.API.Authorization
{
    public class CustomAuthorize : AuthorizeAttribute
    {
        public CustomAuthorize(params RoleEnum[] allowedProfiles)
        {
            allowedProfiles.Append(RoleEnum.ADMIN);

            Roles = string.Join(",", allowedProfiles
                .Select(r => ((int)r).ToString()));
        }

        public CustomAuthorize(string allowedProfiles)
        {
            Roles = allowedProfiles;
        }
    }
}