using System;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace backend.Models
{
    public static class EnumHelper
    {
        public static string GetDescription(Enum enumValue)
        {
            var memberInfo = enumValue
                .GetType()
                .GetMember(enumValue.ToString())
                .FirstOrDefault();

            if (memberInfo != null)
            {
                var attr = memberInfo.GetCustomAttribute<DescriptionAttribute>();
                if (attr != null)
                {
                    return attr.Description;
                }
            }

            // fallback if no description attribute
            return enumValue.ToString();
        }
    }
}